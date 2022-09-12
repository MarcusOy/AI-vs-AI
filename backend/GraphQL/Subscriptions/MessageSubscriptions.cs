using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Execution;
using Microsoft.EntityFrameworkCore;
using Snappy.API.Data;
using Snappy.API.Models;
using Snappy.API.Services;

namespace Snappy.API.GraphQL.Subscriptions
{
    [ExtendObjectType("Subscription")]
    public class MessageSubscriptions
    {
        [Subscribe(With = nameof(SubscribeOnConversationsUpdateAsync)), Topic]
        public Message OnConversationsUpdate(
            [EventMessage] Guid messageId,
            [Service] IMessageService messageService,
            [Service] SnappyDBContext dbContext
        )
        {
            return messageService.GetConversations()
                .Where(m => m.Id == messageId)
                .FirstOrDefault();
        }
        [Authorize]
        public async ValueTask<ISourceStream<Guid>> SubscribeOnConversationsUpdateAsync(
            [Service] ISubscriptionService subService,
            CancellationToken cancellationToken
        )
        {
            return await subService.SubscribeAsync<Guid>(SubscriptionTopic.OnConversationsUpdate, cancellationToken);
        }
    }
}