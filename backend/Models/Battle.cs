using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Models;

[ExportTsInterface]
public class Battle : BaseEntity
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public BattleStatus BattleStatus { get; set; }
    public bool IsTestSubmission { get; set; }
    [Required]
    public int Iterations { get; set; }
    public int AttackerWins { get; set; }
    public int DefenderWins { get; set; }
    public string AttackerStrategySnapshot { get; set; }
    public string DefendingStrategySnapshot { get; set; }

    // Strategy Relationship (Battles are fought by *two* strategies)
    public Guid AttackingStrategyId { get; set; }
    public Strategy AttackingStrategy { get; set; }
    public Guid DefendingStrategyId { get; set; }
    public Strategy DefendingStrategy { get; set; }

    // Battle Relationship (Battles consist of battle games)
    public List<BattleGame> BattleGames { get; set; }
}

public enum BattleStatus
{
    Pending = 0,
    Success = 1,
    Fail = -1
}