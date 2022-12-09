using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public async Task<List<Result>> Search([FromQuery] SearchQueryParameters p)
    {
        if (p.SearchQuery is null || p.SearchQuery.Length <= 2)
            throw new InvalidOperationException("Too few characters. Enter a longer query.");

        var uQuery = _dbContext.Users
            .Where(u => u.FirstName.ToUpper().Contains(p.SearchQuery.ToUpper())
                || u.LastName.ToUpper().Contains(p.SearchQuery.ToUpper())
                || u.Username.ToUpper().Contains(p.SearchQuery.ToUpper()))
            .Select(u => new Result
            {
                Id = u.Id,
                Title = Convert.ToString(u.FirstName + " " + u.LastName),
                Subtitle = Convert.ToString("@" + u.Username),
                Type = ResultType.User,
                CreatedOn = u.CreatedOn
            });

        var sQuery = _dbContext.Strategies
            .Where(u => u.Name.ToUpper().Contains(p.SearchQuery.ToUpper()))
            .Include(s => s.CreatedByUser)
            .Select(s => new Result
            {
                Id = s.Id,
                Title = Convert.ToString(s.Name),
                Subtitle = Convert.ToString("@" + s.CreatedByUser.Username),
                Type = ResultType.Strategy,
                CreatedOn = s.CreatedOn
            });

        var bQuery = _dbContext.Battles
            .Where(u => u.Name.ToUpper().Contains(p.SearchQuery.ToUpper()))
            .Where(u => 1 == 2)
            .Select(b => new Result
            {
                Id = b.Id,
                Title = Convert.ToString(b.Name),
                Subtitle = Convert.ToString("Attacker wins: " + b.AttackerWins + " | Defender wins: " + b.DefenderWins),
                Type = ResultType.Battle,
                CreatedOn = b.CreatedOn
            });

        var q = uQuery.Union(sQuery)
            .Union(bQuery)
            .OrderByDescending(r => r.CreatedOn)
            .Take(10)
            .Skip(0)
        ;

        return await q.ToListAsync();
    }

    public class SearchQueryParameters
    {
        public string SearchQuery { get; set; }
    }

    [ExportTsInterface]
    public class Result
    {
        public Guid Id { get; set; }
        [MaxLength(100)]
        public String Title { get; set; }
        [MaxLength(100)]
        public String Subtitle { get; set; }
        public ResultType Type { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public enum ResultType
    {
        User,
        Strategy,
        Battle
    }
}