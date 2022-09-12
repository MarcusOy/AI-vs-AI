using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using Snappy.API.Models;

namespace Snappy.API.Services
{
    public interface ISubscriptionService
    {
        /// <summary>
        /// Notifies subscribers of a topic along with a payload.
        /// Message is sent to the logged in user.
        /// </summary>
        /// <typeparam name="T">The type of the payload.</typeparam>
        /// <param name="topic">The subscription topic.</param>
        /// <param name="payload">A message sent with the event.</param>
        /// <param name="args">Any additional arguments to make a more
        /// specific topic (such as updates within a single stack).</param>
        /// <returns>Value task of the notification.</returns>
        ValueTask NotifyAsync<T>(SubscriptionTopic topic, T payload, params string[] args);

        /// <summary>
        /// Notifies subscribers of a topic along with a payload.
        /// Message is sent to the passed-in User.
        /// </summary>
        /// <typeparam name="T">The type of the payload.</typeparam>
        /// <param name="topic">The subscription topic.</param>
        /// <param name="payload">A message sent with the event.</param>
        /// <param name="forUser">Who the message is being sent to.</param>
        /// <param name="args">Any additional arguments to make a more
        /// specific topic (such as updates within a single stack).</param>
        /// <returns>Value task of the notification.</returns>
        ValueTask NotifyAsync<T>(SubscriptionTopic topic, T payload, User forUser, params string[] args);

        /// <summary>
        /// Subscribes to events of a topic.
        /// Message is sent to the logged in user.
        /// </summary>
        /// <typeparam name="T">The type of the expected payload.</typeparam>
        /// <param name="topic">The subscription topic.</param>
        /// <param name="cancellationToken">The subscription topic.</param>
        /// <param name="args">Any additional arguments to make a more
        /// specific topic (such as updates within a single stack).</param>
        /// <returns>Value task of the notification.</returns>
        ValueTask<ISourceStream<T>> SubscribeAsync<T>(SubscriptionTopic topic, CancellationToken cancellationToken, params string[] args);
    }
    public class SubscriptionService : ISubscriptionService
    {
        private readonly ITopicEventSender _eventSender;
        private readonly ITopicEventReceiver _eventReceiver;
        private readonly IIdentityService _identityService;

        public SubscriptionService(ITopicEventSender eventSender,
                                   ITopicEventReceiver eventReceiver,
                                   IIdentityService identityService)
        {
            _eventSender = eventSender;
            _eventReceiver = eventReceiver;
            _identityService = identityService;
        }

        public ValueTask NotifyAsync<T>(SubscriptionTopic topic, T payload, params string[] args)
        {
            return NotifyAsync<T>(topic, payload, _identityService.CurrentUser, args);
        }
        public ValueTask NotifyAsync<T>(SubscriptionTopic topic, T payload, User forUser, params string[] args)
        {
            return _eventSender.SendAsync<string, T>(CreateTopicString(topic, args.Prepend(forUser.Username).ToArray()), payload);
        }
        public async ValueTask<ISourceStream<T>> SubscribeAsync<T>(SubscriptionTopic topic, CancellationToken cancellationToken, params string[] args)
        {
            return await _eventReceiver.SubscribeAsync<string, T>(CreateTopicString(topic, args.Prepend(_identityService.CurrentUser.Username).ToArray()), cancellationToken);
        }

        private string CreateTopicString(SubscriptionTopic type,
                                         params string[] args)
        {
            return String.Join('_', args.Prepend(type.ToString()));
        }
    }

    public enum SubscriptionTopic
    {
        OnConversationsUpdate,
        OnUserUpdate
    }
}