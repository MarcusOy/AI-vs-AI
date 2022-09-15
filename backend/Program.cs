using System.Text;
using HotChocolate.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AVA.API.Data;
using AVA.API.Helpers;
using AVA.API.Services;

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

// Add EntityFramework Context
var dbPath = System.IO.Path.Join(
    System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location),
     "AVA.db"
);
builder.Services.AddDbContextPool<AVADbContext>(
    dbContextOptions => dbContextOptions
        .UseSqlite($"Data Source={dbPath}")
        .EnableDetailedErrors()
        .EnableSensitiveDataLogging()
);

builder.Services.AddControllers();

// Added custom JWT Identity Authentication Service
builder.Services.AddScoped<IIdentityService, IdentityService>();
builder.Services.Configure<AVASettings>(o => builder.Configuration.GetSection("AVA").Bind(o));
builder.Services.AddHttpContextAccessor();

// Added JWT authenitcation
var tokenValidator = new TokenValidationParameters
{
    ValidateIssuerSigningKey = true,
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidAudience = settings.Jwt.Audience,
    ValidIssuer = settings.Jwt.Issuer,
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Jwt.Key))
};
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>
{
    o.TokenValidationParameters = tokenValidator;
    o.RequireHttpsMetadata = false;
    o.SaveToken = true;
});
builder.Services.AddSingleton<TokenValidationParameters>(tokenValidator);

// Setting up domain services
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<IInitializationService, InitializationService>();

var app = builder.Build();
#endregion
#region Configure
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseStatusCodePages();
}

app.UseHttpsRedirection();
app.UseWebSockets();
app.UseRouting();

app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseAuthentication();

app.UseAuthorization();

app.UseEndpoints(endpoints => endpoints.MapControllers());

// Initialize the database using the InitializationService
using (var scope = app.Services.CreateScope())
    scope.ServiceProvider.GetRequiredService<IInitializationService>()
        .InitializeDatabase();

app.Run();
#endregion