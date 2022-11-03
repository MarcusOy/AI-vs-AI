using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Models;

[ExportTsInterface]
public class Turn : BaseEntity
{
    [Required, TsOptional]
    public int TurnNumber { get; set; }
    [Required, TsOptional]
    public bool IsAttackTurn { get; set; }
    [Required]
    public string TurnData { get; set; }

    // Battle Relationship PK (Turns make up a battle game, which make up a battle.)
    [Required, TsOptional]
    public Guid BattleId { get; set; }
    [TsOptional]
    public Battle Battle { get; set; }

    // BattleGame Relationship PK (Turns make up a battle game.)
    [Required, TsOptional]
    public int BattleGameNumber { get; set; }
    [TsOptional]
    public BattleGame BattleGame { get; set; }

}