using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Models;

[ExportTsInterface]
public class Strategy : BaseEntity
{
    [Required, TsOptional]
    public Guid Id { get; set; }
    [Required, StringLength(50)]
    public string Name { get; set; }
    public string SourceCode { get; set; }
    [TsOptional]
    public StrategyStatus Status { get; set; }
    [TsOptional]
    public int Version { get; set; }
    [TsOptional]
    public bool IsPrivate { get; set; }
    [TsOptional]
    public bool IsJava { get; set; }
    

    // User Relationship (Strategy is created by user)
    [TsOptional]
    public Guid CreatedByUserId { get; set; }
    [TsOptional]
    public User CreatedByUser { get; set; }

    // Game Relationship (Strategy is used to play game)
    [TsOptional]
    public int GameId { get; set; }
    [TsOptional]
    public Game Game { get; set; }

    // Battle Relationship (Strategy fights in battles)
    [TsOptional]
    public List<Battle> AttackerBattles { get; set; }
    [TsOptional]
    public List<Battle> DefenderBattles { get; set; }
}

public enum StrategyStatus
{
    Draft = 0,
    Active = 1,
    InActive = -1
}