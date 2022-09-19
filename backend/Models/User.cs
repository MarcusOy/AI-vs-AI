using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AVA.API.Models;

public class User : BaseEntity
{
    [Required, JsonIgnore]
    public Guid Id { get; set; }
    [Required]
    public string Username { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    [Required, JsonIgnore]
    public string Password { get; set; }
    [Required, JsonIgnore]
    public string Salt { get; set; }
    [Required]
    public Boolean Active { get; set; }

    // Token Relationship (User uses Tokens to authenticate and refresh authentication)
    [JsonIgnore]
    public List<AuthToken> Tokens { get; set; }

    // Strategy Relationship (User creates strategies)
    public List<Strategy> Strategies { get; set; }

    // BugReport Relationship (User creates bug reports)
    public List<BugReport> BugReports { get; set; }
}