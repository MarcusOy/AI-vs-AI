using System.Threading;
using Snappy.API.Services;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Snappy.API.Models;
using Snappy.API.Data;
using Snappy.API.GraphQL.Extensions;
using Microsoft.IdentityModel.Tokens;

namespace Snappy.API.GraphQL.Queries
{
    [ExtendObjectType("Query")]
    public class MessageQueries
    {
        [Authorize, UsePaging(DefaultPageSize = 25, MaxPageSize = 50, IncludeTotalCount = true), UseFiltering, UseSorting]
        public IQueryable<Message> GetConversations([Service] IHttpContextAccessor context, [Service] IMessageService messageService)
        {
            return messageService.GetConversations();
        }
        [Authorize, UsePaging(DefaultPageSize = 25, MaxPageSize = 50, IncludeTotalCount = true), UseFiltering, UseSorting]
        public IQueryable<Message> GetConversation(Guid userId, [Service] IMessageService messageService)
        {
            return messageService.GetConversation(userId);
        }
    }
}