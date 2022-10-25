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
        var uQuery = _dbContext.Users
            .Where(u => u.FirstName.ToUpper().Contains(p.SearchQuery.ToUpper())
                || u.LastName.ToUpper().Contains(p.SearchQuery.ToUpper())
                || u.Username.ToUpper().Contains(p.SearchQuery.ToUpper()))
            .Select(u => new Result
            {
                Id = u.Id,
                Title = u.FirstName + " " + u.LastName,
                Subtitle = "@" + u.Username,
                Type = ResultType.User,
                CreatedOn = u.CreatedOn
            });

        var sQuery = _dbContext.Strategies
            .Where(u => u.Name.ToUpper().Contains(p.SearchQuery.ToUpper()))
            .Include(s => s.CreatedByUser)
            .Select(s => new Result
            {
                Id = s.Id,
                Title = s.Name,
                Subtitle = "@" + s.CreatedByUser.Username,
                Type = ResultType.Strategy,
                CreatedOn = s.CreatedOn
            });

        var bQuery = _dbContext.Battles
            .Where(u => u.Name.ToUpper().Contains(p.SearchQuery.ToUpper()))
            .Select(b => new Result
            {
                Id = b.Id,
                Title = b.Name,
                Subtitle = "Battle of " + b.Iterations + " iterations",
                Type = ResultType.Batttle,
                CreatedOn = b.CreatedOn
            });

        var q = uQuery.Union(sQuery)
            .Union(bQuery)
            // .Select(r => new Result
            // {
            //     Id = r.Id,
            //     Title = r.Title,
            //     Subtitle = r.Subtitle,
            //     Type = r.Type,
            //     CreatedOn = r.CreatedOn
            // })
            // .OrderByDescending(r => r.CreatedOn)
            // .Take(10)
            // .Skip(0)
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
        public String Title { get; set; }
        public String Subtitle { get; set; }
        public ResultType Type { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public enum ResultType
    {
        User,
        Strategy,
        Batttle
    }
}