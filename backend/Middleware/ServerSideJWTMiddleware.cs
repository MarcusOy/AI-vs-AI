using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Authentication;
using AVA.API.Controllers;
using AVA.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace AVA.API.Middleware;

public class ServerSideJWTMiddleware
{
    public static Task OnMessageRecieved(MessageReceivedContext context)
    {
        context.Token = context.Request.Cookies[AccountController.COOKIE_AUTH_TOKEN];
        return Task.CompletedTask;
    }

    public static async Task OnAuthenticationFailed(AuthenticationFailedContext context)
    {
        ILogger<ServerSideJWTMiddleware> logger = context.HttpContext.RequestServices
            .GetService<ILogger<ServerSideJWTMiddleware>>();
        IIdentityService idService = context.HttpContext.RequestServices
            .GetService<IIdentityService>();
        TokenValidationParameters tokenValidator = context.HttpContext.RequestServices
            .GetService<TokenValidationParameters>();

        try
        {
            var refreshToken = context.Request.Cookies[AccountController.COOKIE_REFRESH_TOKEN];
            var tokenPair = await idService.Reauthenticate(refreshToken);

            context.Exception = null;

            context.Principal = context.HttpContext.User = new JwtSecurityTokenHandler().ValidateToken(tokenPair.AuthToken, tokenValidator, out var authToken);

            context.HttpContext.Response.Cookies.Append(AccountController.COOKIE_AUTH_TOKEN, tokenPair.AuthToken, AccountController.COOKIE_OPTIONS);
            context.HttpContext.Response.Cookies.Append(AccountController.COOKIE_REFRESH_TOKEN, tokenPair.RefreshToken, AccountController.COOKIE_OPTIONS);

            context.Success();
        }
        catch (AuthenticationException ex)
        {
            logger.LogError("Someone failed refreshing their authentication token.");
        }
    }
}