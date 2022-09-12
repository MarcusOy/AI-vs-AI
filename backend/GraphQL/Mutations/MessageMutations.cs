using System.ComponentModel.DataAnnotations;
using System.Threading;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Snappy.API.Helpers;
using Snappy.API.Models;
using Snappy.API.Services;

namespace Snappy.API.GraphQL.Mutations
{
    [ExtendObjectType("Mutation")]

    public class MessageMutations
    {
        [Authorize]
        public async Task<Message> SendMessage(
            SendMessageRequest request,
            Guid sendToUserId,
            [Service] IMessageService messageService)
        {
            var message = new SimpleObjectMapper().Cast<Message>(request);
            return await messageService.SendAsync(message, sendToUserId);
        }
        [Authorize]
        public async Task<Message> DeleteAllMessages(
            Guid userId,
            [Service] IMessageService messageService,
            [Service] ISubscriptionService subService)
        {
            await Task.Run(() => Thread.Sleep(1000));
            return new Message();
            // var clips = await dbContext.Clips
            //     .Where(s => s.DeletedOn == null)
            //     .Where(s => s.OwnerUserId == idService.CurrentUser.Id)
            //     .Where(s => clipIds.Contains(s.Id))
            //     .ToListAsync();

            // if (clips.Count == 0)
            //     throw new InvalidDataException("Clip not found.");

            // foreach (Clip c in clips)
            //     c.DeletedOn = DateTime.UtcNow;

            // dbContext.Clips.UpdateRange(clips);
            // await dbContext.SaveChangesAsync();

            // await subService.NotifyAsync(SubscriptionTopic.OnMessagesUpdate, clips.Select(s => s.Id).ToArray());

            // return clips;
        }
    }

    public class SendMessageRequest
    {
        [Required]
        public string MessageKey { get; set; }
        [Required]
        public string MessagePayload { get; set; }
        [Required]
        public string SenderCopyKey { get; set; }
        [Required]
        public string SenderCopyPayload { get; set; }
    }
}