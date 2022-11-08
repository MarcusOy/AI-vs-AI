using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Models;

[ExportTsInterface]
public class User : BaseEntity
{
    [Required, TsOptional]
    public Guid Id { get; set; }
    [Required, StringLength(15)]
    public string Username { get; set; }
    [Required, StringLength(254)]
    public string Email { get; set; }
    [Required, StringLength(50)]
    public string FirstName { get; set; }
    [Required, StringLength(50)]
    public string LastName { get; set; }
    [Required, JsonIgnore]
    public string Password { get; set; }
    [Required, JsonIgnore]
    public string Salt { get; set; }
    [StringLength(2000)]
    public string Bio { get; set; }
    [Required]
    public Boolean Active { get; set; }

    // Token Relationship (User uses Tokens to authenticate and refresh authentication)
    [JsonIgnore, TsIgnore]
    public List<AuthToken> Tokens { get; set; }

    // Strategy Relationship (User creates strategies)
    public List<Strategy> Strategies { get; set; }

    // BugReport Relationship (User creates bug reports)
    public List<BugReport> BugReports { get; set; }

    // Game Relationship (User has a favorite game)
    public int? FavoriteGameId { get; set; }
    public Game FavoriteGame { get; set; }
}