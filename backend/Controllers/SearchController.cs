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

    [HttpGet, Route("/Interactions/{Page}")]
    public async Task<List<InteractionResult>> PaginatedInteractions(int Page)
    {
        var uQuery = _dbContext.Users
            .Where(u => u.Active == true)
            .Select(u => new InteractionResult
            {
                Id = u.Id,
                Type = InteractionType.User,
                Title = Convert.ToString(u.FirstName + " " + u.LastName),
                SourceCode = null,
                CreatedByGuid = u.Id,
                CreatedByName = Convert.ToString(u.Username),
                Time = u.CreatedOn
            });

        var cQuery = _dbContext.Strategies
            .Where(s => s.Status == StrategyStatus.Draft)
            .Select(s => new InteractionResult
            {
                Id = s.Id,
                Type = InteractionType.CreatedStrategy,
                Title = Convert.ToString(s.Name),
                SourceCode = null,
                CreatedByGuid = s.CreatedByUserId,
                CreatedByName = Convert.ToString("@" + s.CreatedByUser.Username),
                Time = s.CreatedOn
            });

        var sQuery = _dbContext.Strategies
            .Where(s => s.Status == StrategyStatus.Active)
            .Select(s => new InteractionResult
            {
                Id = s.Id,
                Type = InteractionType.SubmittedStrategy,
                Title = Convert.ToString(s.Name),
                SourceCode = s.IsPrivate == true ? null : Convert.ToString(s.SourceCode),
                CreatedByGuid = s.CreatedByUserId,
                CreatedByName = Convert.ToString("@" + s.CreatedByUser.Username),
                Time = s.UpdatedOn
            });

        var q = uQuery.Union(cQuery)
            .Union(sQuery)
            .OrderByDescending(r => r.Time)
            .Take(10)
            .Skip(10 * (Page - 1));

        return await q.ToListAsync();
    }
    [HttpGet, Route("/Interactions/")]
    public async Task<List<InteractionResult>> Interactions()
    {
        var uQuery = _dbContext.Users
            .Where(u => u.Active == true)
            .Where(u => !u.Username.Equals("system"))
            .Select(u => new InteractionResult
            {
                Id = u.Id,
                Type = InteractionType.User,
                Title = Convert.ToString(u.FirstName + " " + u.LastName),
                SourceCode = null,
                CreatedByGuid = u.Id,
                CreatedByName = Convert.ToString(u.Username),
                Time = u.CreatedOn
            });

        var cQuery = _dbContext.Strategies
            .Where(s => s.Status == StrategyStatus.Draft)
            .Select(s => new InteractionResult
            {
                Id = s.Id,
                Type = InteractionType.CreatedStrategy,
                Title = Convert.ToString(s.Name),
                SourceCode = null,
                CreatedByGuid = s.CreatedByUserId,
                CreatedByName = Convert.ToString("@" + s.CreatedByUser.Username),
                Time = s.CreatedOn
            });

        var sQuery = _dbContext.Strategies
            .Where(s => s.Status == StrategyStatus.Active)
            .Where(s => !s.CreatedByUser.Username.Equals("system"))
            .Select(s => new InteractionResult
            {
                Id = s.Id,
                Type = InteractionType.SubmittedStrategy,
                Title = Convert.ToString(s.Name),
                SourceCode = s.IsPrivate == true ? null : Convert.ToString(s.SourceCode),
                CreatedByGuid = s.CreatedByUserId,
                CreatedByName = Convert.ToString("@" + s.CreatedByUser.Username),
                Time = s.UpdatedOn
            });

        var q = uQuery.Union(cQuery)
            .Union(sQuery)
            .OrderByDescending(r => r.Time);


        return await q.ToListAsync();
    }

    [HttpGet, Route("/Interactions/DailyStats")]
    public int[] DailyStats()
    {
        var uQuery = _dbContext.Users
            .Where(u => u.Active == true)
            .Where(u => u.CreatedOn > DateTime.Now.AddDays(-1))
            .Select(u => new InteractionResult
            {
                Id = u.Id,
                Type = InteractionType.User,
                Time = u.CreatedOn
            });

        var cQuery = _dbContext.Strategies
            .Where(s => s.Status == StrategyStatus.Draft)
            .Where(u => u.CreatedOn > DateTime.Now.AddDays(-1))
            .Select(s => new InteractionResult
            {
                Id = s.Id,
                Type = InteractionType.CreatedStrategy,
                Time = s.CreatedOn
            });

        var sQuery = _dbContext.Strategies
            .Where(s => s.Status == StrategyStatus.Active)
            .Where(u => u.CreatedOn > DateTime.Now.AddDays(-1))
            .Select(s => new InteractionResult
            {
                Id = s.Id,
                Type = InteractionType.SubmittedStrategy,
                Time = s.UpdatedOn
            });
        var stats = new int[3];
        uQuery.Union(cQuery)
            .Union(sQuery)
            .OrderByDescending(r => r.Time).ToList().ForEach(u =>
            stats[u.Type == InteractionType.SubmittedStrategy ? 2 : u.Type == InteractionType.CreatedStrategy ? 1 : 0] += 1);
        return stats;
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
    public class InteractionResult
    {
        public Guid Id { get; set; }
        public InteractionType Type { get; set; }
        [MaxLength(100)]
        public String Title { get; set; }
        public String SourceCode { get; set; }
        public Guid CreatedByGuid { get; set; }
        public String CreatedByName { get; set; }
        public DateTime Time { get; set; }
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

    public enum InteractionType
    {
        User,
        CreatedStrategy,
        SubmittedStrategy
    }
}