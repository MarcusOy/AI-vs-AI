using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AVA.API.Models;

public class Strategy : BaseEntity
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    public string Name { get; set; }
    public string SourceCode { get; set; }
    public StrategyStatus Status { get; set; }
    public int Version { get; set; }

    // User Relationship (Strategy is created by user)
    public Guid CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; }

    // Game Relationship (Strategy is used to play game)
    public int GameId { get; set; }
    public Game Game { get; set; }

    // Battle Relationship (Strategy fights in battles)
    public List<Battle> AttackerBattles { get; set; }
    public List<Battle> DefenderBattles { get; set; }
}

public enum StrategyStatus
{
    Draft = 0,
    Active = 1,
    InActive = -1
}