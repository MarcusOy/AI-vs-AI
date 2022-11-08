using System.Text.Json.Serialization;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Models;

[ExportTsInterface]
public class BaseEntity
{
    [TsOptional]
    public DateTime CreatedOn { get; set; }
    [TsOptional]
    public DateTime UpdatedOn { get; set; }
    [JsonIgnore, TsOptional]
    public DateTime? DeletedOn { get; set; }
}