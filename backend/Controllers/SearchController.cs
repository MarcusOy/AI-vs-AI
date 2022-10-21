using System.Text.Json.Serialization;
using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Controllers;

public class SearchController : Controller
{

    private readonly AVADbContext _dbContext;

    public SearchController(AVADbContext dbContext) : base()
    {
        _dbContext = dbContext;
    }

    [HttpGet, Route("/Search"), Authorize]
    public List<Result> Search([FromQuery] SearchQueryParameters p)
        => _dbContext.Users
            .Where(u => u.FirstName.ToUpper().Contains(p.SearchQuery.ToUpper())
                || u.LastName.ToUpper().Contains(p.SearchQuery.ToUpper())
                || u.Username.ToUpper().Contains(p.SearchQuery.ToUpper()))
            .Select(u => new Result
            {
                Id = u.Id,
                Title = $"{u.FirstName} {u.LastName}",
                Subtitle = $"@{u.Username}",
                Type = ResultType.User
            }).ToList();

    public class SearchQueryParameters
    {
        public string SearchQuery { get; set; }
    }

    [ExportTsInterface]
    public class Result
    {
        public Guid Id { get; set; }
        public String Title { get; set; }
        public String Subtitle { get; set; }
        public ResultType Type { get; set; }
    }

    public enum ResultType
    {
        User,
        Strategy,
        Batttle
    }
}