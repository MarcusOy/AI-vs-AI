using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Execution;
using Microsoft.EntityFrameworkCore;
using Snappy.API.Data;
using Snappy.API.Models;
using Snappy.API.Services;

namespace Snappy.API.GraphQL.Subscriptions
{
    [ExtendObjectType("Subscription")]
    public class AuthSubscriptions
    {
        [Subscribe(With = nameof(SubscribeOnUserUpdatedAsync)), Topic]
        public User OnUserUpdated(
            [EventMessage] Guid userId,
            [Service] IIdentityService idService
        )
        {
            return idService.CurrentUser;
        }
        [Authorize]
        public async ValueTask<ISourceStream<Guid>> SubscribeOnUserUpdatedAsync(
            [Service] ISubscriptionService subService,
            CancellationToken cancellationToken
        )
        {
            return await subService.SubscribeAsync<Guid>(SubscriptionTopic.OnUserUpdate, cancellationToken);
        }
    }
}