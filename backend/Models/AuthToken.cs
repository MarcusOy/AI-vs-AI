using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Snappy.API.Models
{
    public class AuthToken : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string Token { get; set; }
        [Required]
        public DateTime ExpiresOn { get; set; }
        [GraphQLIgnore]
        public bool IsExpired => DateTime.UtcNow >= ExpiresOn;

        public DateTime? RevokedOn { get; set; }
        [GraphQLIgnore]
        public bool IsActive => RevokedOn == null && !IsExpired;

        // User relationship
        public Guid UserId { get; set; }
        public User User { get; set; }

        // Token relationship
        public Guid? ReplacedByTokenId { get; set; }
        public AuthToken ReplacedByToken { get; set; }

    }

    public static class AuthTokenType
    {
        public const string Auth = "Auth";
        public const string Refresh = "Refresh";
        public const string TwoFactor = "TwoFactor";
    }
}