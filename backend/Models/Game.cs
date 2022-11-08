using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Models;

[ExportTsInterface]
public class Game : BaseEntity
{
    [Required]
    public int Id { get; set; }
    [Required, StringLength(50)]
    public string Name { get; set; }
    [Required, StringLength(100)]
    public string ShortDescription { get; set; }
    [StringLength(2000)]
    public string LongDescription { get; set; }
    public string BoilerplateCode { get; set; }
    public string HelperCode { get; set; }

    // Strategy Relationship (Game is played by strategies)
    public List<Strategy> Strategies { get; set; }

    // User Relationship (Game is favorited by many users)
    [JsonIgnore]
    public List<User> UsersWhoFavorited { get; set; }
}