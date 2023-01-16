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

public class LeaderboardController : Controller
{
    private readonly IStrategiesService _strategyService;

    private readonly AVADbContext _dbContext;

    public LeaderboardController(IStrategiesService strategiesService, AVADbContext dbContext)
    {
        _strategyService = strategiesService;
        _dbContext = dbContext;
    }

    [HttpGet, Route("/Leaderboard/Get/{gameId}")]
    public async Task<List<Strategy>> Get(int gameId)
    {
        var leaderboardQuery = _dbContext.Strategies
            .Where(s => s.GameId == gameId)
            .Where(s => s.Status == StrategyStatus.Active)
            .OrderByDescending(s => s.Elo)
            .Take(10);

        return await leaderboardQuery.ToListAsync();
    }
}