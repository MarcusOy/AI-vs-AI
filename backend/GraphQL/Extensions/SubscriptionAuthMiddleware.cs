using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Subscriptions;
using HotChocolate.AspNetCore.Subscriptions.Messages;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Tokens;

namespace Snappy.API.GraphQL.Extensions
{
    public class SubscriptionAuthMiddleware : ISocketSessionInterceptor
    {
#pragma warning disable CS1998 // To remove 'no await on async' warning
        public async ValueTask OnCloseAsync(
            ISocketConnection connection,
            CancellationToken cancellationToken
        )
        { }
        public async ValueTask OnRequestAsync(
            ISocketConnection connection,
            IQueryRequestBuilder requestBuilder,
            CancellationToken cancellationToken
        )
        { }

        /* We don't need the above two methods, just this one */
        public async ValueTask<ConnectionStatus> OnConnectAsync(
            ISocketConnection connection,
            InitializeConnectionMessage message,
            CancellationToken cancellationToken
        )
        {
            try
            {
                // Get JWT token from payload
                var jwtHeader = message.Payload["Authorization"] as string ?? "";

                // Check if token is provided
                if (string.IsNullOrEmpty(jwtHeader))
                    return ConnectionStatus.Reject("WSAuth: No token provided.");

                // Remove 'Bearer' from token if necessary
                var token = jwtHeader.Replace("Bearer ", "");

                // Validate JWT token based on validation parameters from Startup.cs
                var validator = connection.HttpContext.RequestServices.GetRequiredService<TokenValidationParameters>();
                var claims = new JwtBearerBacker(validator).IsJwtValid(token);
                if (claims == null)
                    return ConnectionStatus.Reject("WSAuth: Invalid token.");

                // Set authenticated user as resulting ClaimsPrinciple
                connection.HttpContext.User = claims;

                // Accept the websocket connection
                return ConnectionStatus.Accept();
            }
            catch (Exception ex)
            {
                // Maybe make more robust error reporting here...?
                return ConnectionStatus.Reject($"WSAuth: Something went wrong: {ex.Message}");
            }
        }
#pragma warning restore CS1998 
    }

    public class JwtBearerBacker
    {
        public JwtBearerOptions Options { get; private set; }

        public JwtBearerBacker(TokenValidationParameters tokenValidator)
        {
            this.Options = new JwtBearerOptions
            {
                TokenValidationParameters = tokenValidator,
                RequireHttpsMetadata = false,
                SaveToken = true,
            };
        }

        public ClaimsPrincipal IsJwtValid(string token)
        {
            List<Exception> validationFailures = null;
            SecurityToken validatedToken;
            foreach (var validator in Options.SecurityTokenValidators)
            {
                // Ensure we can even read the token at all
                if (validator.CanReadToken(token))
                {
                    try
                    {
                        // Try to return a ClaimsPrincipal if we can
                        // Otherwise an exception is thrown, caught and we continue on.
                        return validator
                            .ValidateToken(token, Options.TokenValidationParameters, out validatedToken);
                    }
                    catch (Exception ex)
                    {
                        // If the keys are invalid, refresh config
                        if (Options.RefreshOnIssuerKeyNotFound && Options.ConfigurationManager != null
                            && ex is SecurityTokenSignatureKeyNotFoundException)
                        {
                            Options.ConfigurationManager.RequestRefresh();
                        }

                        // Add to our list of failures. This was from the OG code
                        // Not sure what we need it for.
                        if (validationFailures == null)
                            validationFailures = new List<Exception>(1);

                        validationFailures.Add(ex);
                        continue;
                    }
                }
            }

            // No user could be found
            return null;
        }
    }


}