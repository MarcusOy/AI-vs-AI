using Microsoft.EntityFrameworkCore;
using Snappy.API.Helpers;
using Snappy.API.Models;

namespace Snappy.API.Data;

public static class SeedData
{
    public static ModelBuilder HasSeedData(this ModelBuilder builder)
    {
        return builder.HasExampleUsers()
            .HasExampleMessages();
    }

    private static ModelBuilder HasExampleUsers(this ModelBuilder builder)
    {
        var marcusId = Guid.NewGuid();
        var marcusSalt = SecurityHelpers.GenerateSalt();
        var kyleId = Guid.NewGuid();
        var kyleSalt = SecurityHelpers.GenerateSalt();
        var patrickId = Guid.NewGuid();
        var patrickSalt = SecurityHelpers.GenerateSalt();
        builder.Entity<User>().HasData(
            new User
            {
                Id = marcusId,
                FirstName = "Marcus",
                LastName = "Orciuch",
                Username = "marcus",
                Password = SecurityHelpers.GenerateHashedPassword("password", marcusSalt.AsBytes),
                Salt = marcusSalt.AsString,
                PublicKey = "key",
                TwoFactorKey = SecurityHelpers.GenerateTwoFactorSecret(),
                Active = true
            },
            new User
            {
                Id = kyleId,
                FirstName = "Kyle",
                LastName = "Orciuch",
                Username = "kyle",
                Password = SecurityHelpers.GenerateHashedPassword("password", kyleSalt.AsBytes),
                Salt = kyleSalt.AsString,
                PublicKey = "key",
                TwoFactorKey = SecurityHelpers.GenerateTwoFactorSecret(),
                Active = true
            },
            new User
            {
                Id = patrickId,
                FirstName = "Patrick",
                LastName = "Mansour",
                Username = "patrick",
                Password = SecurityHelpers.GenerateHashedPassword("password", patrickSalt.AsBytes),
                Salt = patrickSalt.AsString,
                PublicKey = "key",
                TwoFactorKey = SecurityHelpers.GenerateTwoFactorSecret(),
                Active = true
            }
        );

        builder.Entity<Message>().HasData(
            new Message
            {
                Id = Guid.NewGuid(),
                MessageKey = "messageKey",
                MessagePayload = "Hi kyle, how are you doing?",
                SenderCopyKey = "senderKey",
                SenderCopyPayload = "Hi kyle, how are you doing?",
                SenderId = marcusId,
                ReceiverId = kyleId,
                CreatedOn = DateTime.UtcNow.AddMinutes(0)
            },
            new Message
            {
                Id = Guid.NewGuid(),
                MessageKey = "messageKey",
                MessagePayload = "I am doing great! Hbu?",
                SenderCopyKey = "senderKey",
                SenderCopyPayload = "I am doing great! Hbu?",
                SenderId = kyleId,
                ReceiverId = marcusId,
                CreatedOn = DateTime.UtcNow.AddMinutes(1)
            },
            new Message
            {
                Id = Guid.NewGuid(),
                MessageKey = "messageKey",
                MessagePayload = "Great as well!",
                SenderCopyKey = "senderKey",
                SenderCopyPayload = "Great as well!",
                SenderId = marcusId,
                ReceiverId = kyleId,
                CreatedOn = DateTime.UtcNow.AddMinutes(2)
            },
            new Message
            {
                Id = Guid.NewGuid(),
                MessageKey = "messageKey",
                MessagePayload = "Hi marcus, how are you doing?",
                SenderCopyKey = "senderKey",
                SenderCopyPayload = "Hi kyle, how are you doing?",
                SenderId = patrickId,
                ReceiverId = marcusId,
                CreatedOn = DateTime.UtcNow.AddMinutes(1)
            },
            new Message
            {
                Id = Guid.NewGuid(),
                MessageKey = "messageKey",
                MessagePayload = "I am doing great! Hbu?",
                SenderCopyKey = "senderKey",
                SenderCopyPayload = "I am doing great! Hbu?",
                SenderId = marcusId,
                ReceiverId = patrickId,
                CreatedOn = DateTime.UtcNow.AddMinutes(3)
            },
            new Message
            {
                Id = Guid.NewGuid(),
                MessageKey = "messageKey",
                MessagePayload = "Great as well!",
                SenderCopyKey = "senderKey",
                SenderCopyPayload = "Great as well!",
                SenderId = patrickId,
                ReceiverId = marcusId,
                CreatedOn = DateTime.UtcNow.AddMinutes(5)
            }
        );
        return builder;
    }

    private static ModelBuilder HasExampleMessages(this ModelBuilder builder)
    {
        return builder;
    }
}