using System.Text.Json.Serialization;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Models;

[ExportTsInterface]
public class BaseEntity
{
    [JsonIgnore]
    public DateTime CreatedOn { get; set; }
    [JsonIgnore]
    public DateTime UpdatedOn { get; set; }
    [JsonIgnore]
    public DateTime? DeletedOn { get; set; }
}