using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Snappy.API.Models;
public class Message : BaseEntity
{
    [Required, JsonIgnore]
    public Guid Id { get; set; }
    [Required]
    public string MessageKey { get; set; }
    [Required]
    public string MessagePayload { get; set; }
    [Required]
    public string SenderCopyKey { get; set; }
    [Required]
    public string SenderCopyPayload { get; set; }
    [Required]
    public Guid SenderId { get; set; }
    public User Sender { get; set; }
    [Required]
    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; }
    [NotMapped]
    public Guid OtherUserId { get; set; }
    [NotMapped]
    public User OtherUser { get; set; }
}