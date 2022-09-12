using System.Text;
using Snappy.API.GraphQL.Mutations;
using HotChocolate.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Snappy.API.Data;
using Snappy.API.GraphQL.Extensions;
using Snappy.API.Helpers;
using Snappy.API.Services;
using Snappy.API.GraphQL.Queries;
using Snappy.API.GraphQL.Subscriptions;

#region ConfigureServices
// Load environment variables (.env)
var root = Directory.GetCurrentDirectory();
var dotenv = System.IO.Path.Combine(root, ".env");
EnvironmentHelpers.LoadEnv(dotenv);

// Create app builder
var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// Get settings from environment configuration
var settings = new SnappySettings();
builder.Configuration.GetSection("Snappy").Bind(settings);

// Add EntityFramework Context
var dbPath = System.IO.Path.Join(
    System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location),
     "Snappy.db"
);
builder.Services.AddDbContextPool<SnappyDBContext>(
    dbContextOptions => dbContextOptions
        .UseSqlite($"Data Source={dbPath}")
        .EnableDetailedErrors()
        .EnableSensitiveDataLogging()
);

builder.Services.AddControllers();

// Added custom JWT Identity Authentication Service
builder.Services.AddScoped<ITwoFactorService, TotpTwoFactorService>();
builder.Services.AddScoped<IIdentityService, IdentityService>();
builder.Services.Configure<SnappySettings>(o => builder.Configuration.GetSection("Snappy").Bind(o));
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

// Setting up GraphQL server
builder.Services.AddGraphQLServer()
    .AddType<UploadType>()
    .BindRuntimeType<DateTime, UtcDateTimeType>()
    .AddMutationType(d => d.Name("Mutation"))
        .AddTypeExtension<AuthMutations>()
        .AddTypeExtension<MessageMutations>()
    .AddQueryType(d => d.Name("Query"))
        .AddTypeExtension<UserQueries>()
        .AddTypeExtension<MessageQueries>()
    .AddSubscriptionType(d => d.Name("Subscription"))
        .AddTypeExtension<AuthSubscriptions>()
        .AddTypeExtension<MessageSubscriptions>()
    .AddAuthorization()
    .AddSocketSessionInterceptor<SubscriptionAuthMiddleware>()
    .AddInMemorySubscriptions()
    .AddErrorFilter<ErrorFilter>()
    .AddFiltering()
    .AddSorting();

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

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapGraphQL("/api/v1/graphql");
});

app.UsePlayground("/api/v1/graphql");

using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<IInitializationService>()
        .InitializeDatabase();
}

app.Run();
#endregion