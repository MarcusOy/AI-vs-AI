using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AVA.API.Models;

public class BattleGame : BaseEntity
{
    [Required]
    public int GameNumber { get; set; }
    [Required]
    public bool DidAttackerWin { get; set; }

    // Battle Relationship PK (Battle game is a part of a battle)
    [Required]
    public Guid BattleId { get; set; }
    public Battle Battle { get; set; }

    // Turn Relationship (Battle game consists of turns)
    public List<Turn> Turns { get; set; }
}