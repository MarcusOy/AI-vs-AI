// using System;
// using System.Linq;
// using Microsoft.Data.Sqlite;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.Extensions.Options;
// using AVA.API.Data;
// using AVA.API.Models;

// namespace AVA.API.Services
// {
//     public interface IMessageService
//     {
//         /// <summary>
//         /// Gets all conversations (last message for each conversation)
//         /// </summary>
//         /// <returns></returns>
//         IQueryable<Message> GetConversations();
//         /// <summary>
//         /// Returns all messages within a conversation 
//         /// between current user and provided user.
//         /// </summary>
//         /// <param name="userId"></param>
//         /// <returns></returns>
//         IQueryable<Message> GetConversation(Guid userId);
//         /// <summary>
//         /// Sends a message with provided string content to
//         /// provided user.
//         /// </summary>
//         /// <param name="message">The message to send</param>
//         /// <param name="toUserId">The user id of the receipient</param>
//         /// <returns></returns>
//         Task<Message> SendAsync(Message message, Guid toUserId);
//     }

//     public class MessageService : IMessageService
//     {
//         private readonly ILogger<MessageService> _logger;
//         private readonly AVADbContext _dbContext;
//         private readonly AVASettings _settings;
//         private readonly IIdentityService _idService;
//         private readonly ISubscriptionService _subService;

//         public MessageService(IHttpContextAccessor context,
//                             ILogger<MessageService> logger,
//                             AVADbContext dbContext,
//                             IOptions<AVASettings> settings,
//                             IIdentityService idService,
//                             ISubscriptionService subService)
//         {
//             _logger = logger;
//             _dbContext = dbContext;
//             _settings = settings.Value;
//             _idService = idService;
//             _subService = subService;
//         }

//         public IQueryable<Message> GetConversations()
//         {
//             var userId = new SqliteParameter("userId", _idService.CurrentUser.Id);
//             var convos = _dbContext.Messages
//                 .FromSqlRaw(@"
//                 SELECT *, MAX(CreatedOn),
//                     CASE
//                         WHEN SenderId = @userId THEN ReceiverId ELSE SenderId
//                     END AS OtherUserId
//                 FROM Messages
//                 WHERE SenderId = @userId OR ReceiverId = @userId
//                 GROUP BY OtherUserId
//                 ORDER BY CreatedOn DESC
//                 ", userId)
//                 .Include(m => m.Sender)
//                 .Include(m => m.Receiver)
//                 .Select(m => new Message
//                 {
//                     Id = m.Id,
//                     MessageKey = m.MessageKey,
//                     MessagePayload = m.MessagePayload,
//                     SenderCopyKey = m.SenderCopyKey,
//                     SenderCopyPayload = m.SenderCopyPayload,
//                     SenderId = m.SenderId,
//                     Sender = m.Sender,
//                     ReceiverId = m.ReceiverId,
//                     Receiver = m.Receiver,
//                     CreatedOn = m.CreatedOn,
//                     OtherUserId = m.SenderId == _idService.CurrentUser.Id
//                             ? m.ReceiverId : m.SenderId,
//                     OtherUser = m.SenderId == _idService.CurrentUser.Id
//                             ? m.Receiver : m.Sender
//                 });

//             return convos;
//         }

//         public IQueryable<Message> GetConversation(Guid userId)
//         {
//             return _dbContext.Messages
//                 .Where(m => m.SenderId == _idService.CurrentUser.Id && m.ReceiverId == userId
//                          || m.ReceiverId == _idService.CurrentUser.Id && m.SenderId == userId)
//                 .Include(m => m.Sender)
//                 .Include(m => m.Receiver)
//                 .OrderByDescending(m => m.CreatedOn)
//                 .Select(m => new Message
//                 {
//                     Id = m.Id,
//                     MessageKey = m.MessageKey,
//                     MessagePayload = m.MessagePayload,
//                     SenderCopyKey = m.SenderCopyKey,
//                     SenderCopyPayload = m.SenderCopyPayload,
//                     SenderId = m.SenderId,
//                     Sender = m.Sender,
//                     ReceiverId = m.ReceiverId,
//                     Receiver = m.Receiver,
//                     CreatedOn = m.CreatedOn,
//                     OtherUserId = m.SenderId == _idService.CurrentUser.Id
//                             ? m.ReceiverId : m.SenderId,
//                     OtherUser = m.SenderId == _idService.CurrentUser.Id
//                             ? m.Receiver : m.Sender
//                 });
//         }

//         public async Task<Message> SendAsync(Message message, Guid toUserId)
//         {
//             if (message is null)
//                 throw new InvalidOperationException("Invalid message object.");

//             var toUser = _dbContext.Users
//                 .FirstOrDefault(u => u.Id == toUserId);
//             if (toUser is null || toUserId == _idService.CurrentUser.Id)
//                 throw new InvalidOperationException("Invalid receipient user.");

//             message.SenderId = _idService.CurrentUser.Id;
//             message.ReceiverId = toUserId;

//             await _dbContext.Messages.AddAsync(message);
//             await _dbContext.SaveChangesAsync();

//             await _subService.NotifyAsync(SubscriptionTopic.OnConversationsUpdate, message.Id);
//             await _subService.NotifyAsync(SubscriptionTopic.OnConversationsUpdate, message.Id, toUser);

//             return message;
//         }
//     }
// }