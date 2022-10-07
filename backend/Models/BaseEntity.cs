using System.Text.Json.Serialization;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Models;

[ExportTsInterface]
public class BaseEntity
{
    [JsonIgnore, TsOptional]
    public DateTime CreatedOn { get; set; }
    [JsonIgnore, TsOptional]
    public DateTime UpdatedOn { get; set; }
    [JsonIgnore, TsOptional]
    public DateTime? DeletedOn { get; set; }
}