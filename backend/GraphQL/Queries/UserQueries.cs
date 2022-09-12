using Snappy.API.Services;
using HotChocolate.AspNetCore.Authorization;
using Snappy.API.Models;
using Snappy.API.Data;

namespace Snappy.API.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public class UserQueries
    {
        [Authorize]
        public User WhoAmI([Service] IIdentityService idService)
        {
            return idService.CurrentUser;
        }
        [Authorize]
        public User GetUserByUsername([Service] SnappyDBContext dBContext, string username)
        {
            Thread.Sleep(1000);
            var u = dBContext.Users
                .Where(u => u.Active)
                .FirstOrDefault(u => u.Username == username);

            if (u is null)
                throw new InvalidOperationException($"User not found.");

            return u;
        }
    }
}