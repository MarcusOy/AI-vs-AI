using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AVA.API.Models;

public class Turn : BaseEntity
{
    [Required]
    public int TurnNumber { get; set; }
    [Required]
    public bool IsAttackTurn { get; set; }
    [Required]
    public string TurnData { get; set; }

    // Battle Relationship PK (Turns make up a battle game, which make up a battle.)
    [Required]
    public Guid BattleId { get; set; }
    public Battle Battle { get; set; }

    // BattleGame Relationship PK (Turns make up a battle game.)
    [Required]
    public int BattleGameNumber { get; set; }
    public BattleGame BattleGame { get; set; }

}