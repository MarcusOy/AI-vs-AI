using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AVA.API.Models;

public class Game : BaseEntity
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public string ShortDescription { get; set; }
    public string LongDescription { get; set; }
    [Required]
    public string BoilerplateCode { get; set; }

    // Strategy Relationship (Game is played by strategies)
    public List<Strategy> Strategies { get; set; }
}