using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Models;

[ExportTsInterface]
public class StarterCode : BaseEntity
{
    [Required]
    public StarterCodeType Type { get; set; }
    [Required]
    public ProgrammingLanguage Language { get; set; }
    public string Code { get; set; }

    // Game relationship (Different types and languages of starter code are code used for a game)
    [Required]
    public int GameId { get; set; }
    public Game Game { get; set; }
}

public enum StarterCodeType
{
    Boilerplate = 0,
    Helper = 1
}