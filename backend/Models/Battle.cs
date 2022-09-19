using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AVA.API.Models;

public class Battle : BaseEntity
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public BattleStatus BattleStatus { get; set; }
    [Required]
    public int Iterations { get; set; }
    public int AttackerWins { get; set; }
    public int DefenderWins { get; set; }
    public string StackTrace { get; set; }

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