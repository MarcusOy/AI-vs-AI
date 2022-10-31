using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AVA.API.Data;
using AVA.API.Helpers;
using AVA.API.Services;
using AVA.API.Controllers;
using AVA.API.Middleware;
using MassTransit;
using AVA.API.Consumers;
using AVA.API.Hubs;

#region ConfigureServices
// Load environment variables (.env)
var root = Directory.GetCurrentDirectory();
var dotenv = System.IO.Path.Combine(root, ".env");
EnvironmentHelpers.LoadEnv(dotenv);

// Create app builder
var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// Get settings from environment configuration
var settings = new AVASettings();
builder.Configuration.GetSection("AVA").Bind(settings);

if (String.IsNullOrEmpty(settings.ConnectionString))
    throw new ArgumentException("The environment variable AVA__CONNECTIONSTRING must be set with a valid connection string pointing towards a MySQL database.");

if (String.IsNullOrEmpty(settings.JwtKey))
    throw new ArgumentException("The envronment variable AVA__JWTKEY must be set with a secret key.");


// Add EntityFramework Context
builder.Services.AddDbContextPool<AVADbContext>(
    dbContextOptions => dbContextOptions
        .UseMySql(settings.ConnectionString, new MySqlServerVersion(new Version(5, 7)))
        .EnableDetailedErrors()
        .EnableSensitiveDataLogging()
);

builder.Services.AddControllers()
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles
    );

builder.Services.AddMassTransit(mt =>
{
    mt.AddConsumer<SimulationResponsesConsumer>();

    mt.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(settings.RabbitMQ.Host, "/", h =>
        {
            h.Username(settings.RabbitMQ.User);
            h.Password(settings.RabbitMQ.Password);
        });
        cfg.ConfigureEndpoints(context);
    });
});

// Add websockets functionality
builder.Services.AddSignalR();

// Added custom JWT Identity Authentication Service
builder.Services.AddScoped<IIdentityService, IdentityService>();
builder.Services.Configure<AVASettings>(o => builder.Configuration.GetSection("AVA").Bind(o));
builder.Services.AddHttpContextAccessor();

// Added JWT authenitcation
var tokenValidator = new TokenValidationParameters
{
    ValidateIssuerSigningKey = true,
    ValidateIssuer = true,
    ValidateAudience = false,
    ValidateLifetime = true,
    ValidIssuer = "AVA",
    ClockSkew = TimeSpan.Zero,
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.JwtKey))
};
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>
{
    o.TokenValidationParameters = tokenValidator;
    o.RequireHttpsMetadata = false;
    o.SaveToken = true;
    o.Events = new JwtBearerEvents
    {
        OnMessageReceived = ServerSideJWTMiddleware.OnMessageRecieved,
        OnAuthenticationFailed = ServerSideJWTMiddleware.OnAuthenticationFailed
    };
});
builder.Services.AddSingleton<TokenValidationParameters>(tokenValidator);

// Setting up domain services
builder.Services.AddScoped<IGamesService, GamesService>();
builder.Services.AddScoped<IStrategiesService, StrategiesService>();
builder.Services.AddScoped<IBugsService, BugsService>();
builder.Services.AddScoped<IBattlesService, BattlesService>();
builder.Services.AddScoped<IInitializationService, InitializationService>();

var app = builder.Build();
#endregion
#region Configure
// Configure the HTTP request pipeline.
app.UseWebSockets();
app.UseRouting();

app.UseCors(x => x
    .AllowCredentials()
    .WithOrigins(
        "https://localhost:3000", // local development url
        "https://127.0.0.1:3000", // local development url
        "https://ai-vs-ai.vercel.app", // production url
        "https://ai-vs-ai-git-dev-marcusoy.vercel.app" // remote development url
    )
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionMiddleware>();
app.UseEndpoints(endpoints => endpoints.MapControllers());

app.MapHub<SimulationStepHub>("/AI/Step");

// Initialize the database using the InitializationService
using (var scope = app.Services.CreateScope())
    scope.ServiceProvider.GetRequiredService<IInitializationService>()
        .InitializeDatabase();

app.Run("https://0.0.0.0:443");
#endregion