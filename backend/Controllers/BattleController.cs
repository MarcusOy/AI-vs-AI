using System.Configuration;
using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class BattleController : Controller
{
    private readonly IBattlesService _battleService;

    public BattleController(IBattlesService battleService)
    {
        _battleService = battleService;
    }
    // [HttpGet, Route("/Battles")]
    // public List<Battle> GetBattles([FromQuery(Name = "StrategyId")] string strategyId)
    // {

    // }
    [HttpGet, Route("/Battle/{id}")]
    public Battle GetBattle(string id)
    {
        return _battleService.Get(new Guid(id));
    }
    [HttpGet, Route("/Battle/{id}/{num}")]
    public BattleGame GetBattleGame(string id, string num)
    {
        var n = int.Parse(num);
        return _battleService.GetBattleGame(new Guid(id), n);
    }
}