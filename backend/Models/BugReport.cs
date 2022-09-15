using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AVA.API.Models;

public class BugReport : BaseEntity
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    public string Description { get; set; }
    public string Regarding { get; set; }

    // User Relationship (Bug report is created by user)
    public Guid CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; }
}