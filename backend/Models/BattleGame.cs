using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Models;

[ExportTsInterface]
public class BattleGame : BaseEntity
{
    [Required]
    public int GameNumber { get; set; }
    [Required]
    public bool IsAttackerWhite { get; set; }
    [Required]
    public bool DidAttackerWin { get; set; }
    public string StackTrace { get; set; }

    // Battle Relationship PK (Battle game is a part of a battle)
    [Required]
    public Guid BattleId { get; set; }
    public Battle Battle { get; set; }
    public String FinalBoard { get; set; }
    public int AttackerPiecesLeft { get; set; }
    public int AttackerPawnsLeft { get; set; }
    public int DefenderPiecesLeft { get; set; }
    public int DefenderPawnsLeft { get; set; }

    // Turn Relationship (Battle game consists of turns)
    public List<Turn> Turns { get; set; }
}