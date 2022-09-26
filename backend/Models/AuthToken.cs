using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AVA.API.Models
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
        public bool IsExpired => DateTime.UtcNow >= ExpiresOn;
        public DateTime? RevokedOn { get; set; }
        public bool IsActive => RevokedOn == null && !IsExpired;

        // User Relationship (Auth token is used by user to auth)
        public Guid UserId { get; set; }
        public User User { get; set; }

        // Token Relationship (Auth token is replaced by another auth token)
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