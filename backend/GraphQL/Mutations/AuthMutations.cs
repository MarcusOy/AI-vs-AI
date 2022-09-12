using System.Reflection.PortableExecutable;
using System.Threading.Tasks;
using System.Threading;
using HotChocolate;
using HotChocolate.Types;
using Snappy.API.Services;
using Snappy.API.Models;

namespace Snappy.API.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]
    public class AuthMutations
    {
        public async Task<RegistrationResponse> Register(string firstName,
                                                         string lastName,
                                                         string username,
                                                         string password,
                                                         string publicKey,
                                                         [Service] IIdentityService identityService)
        {
            Thread.Sleep(1000);
            var registrationDetails = await identityService.Register(firstName, lastName, username, password, publicKey);
            return new RegistrationResponse
            {
                User = registrationDetails.User,
                TotpSecret = registrationDetails.TotpSecret
            };
        }
        public async Task<GetTokenResponse> ActivateAccount(string username,
                                                            string code,
                                                            [Service] IIdentityService identityService)
        {
            Thread.Sleep(1000);
            var tokens = await identityService.ActivateAccount(username, code);
            return new GetTokenResponse
            {
                AuthToken = tokens.AuthToken,
                RefreshToken = tokens.RefreshToken
            };
        }

        public async Task<GetTokenResponse> Authenticate(string username,
                                                         string password,
                                                         string code,
                                                         [Service] IIdentityService identityService)
        {
            Thread.Sleep(1000);
            var tokens = await identityService.Authenticate(username, password, code);
            return new GetTokenResponse
            {
                AuthToken = tokens.AuthToken,
                RefreshToken = tokens.RefreshToken
            };
        }

        public async Task<GetTokenResponse> Reauthenticate(string token,
                                                           [Service] IIdentityService identityService)
        {
            Thread.Sleep(1000);
            var tokens = await identityService.Reauthenticate(token);
            return new GetTokenResponse
            {
                AuthToken = tokens.AuthToken,
                RefreshToken = tokens.RefreshToken
            };
        }
    }
    public class RegistrationResponse
    {
        public User User { get; set; }
        public string TotpSecret { get; set; }
    }
    public class GetTokenResponse
    {
        public string AuthToken { get; set; }
        public string RefreshToken { get; set; }
    }

}