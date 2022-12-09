using System.Configuration;
using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Mvc;
using static AVA.API.Services.BattlesService;

namespace AVA.API.Controllers;

public class BattleController : Controller
{
    private readonly IBattlesService _battleService;
    public BattleController(IBattlesService battleService)
    {
        _battleService = battleService;
    }
    [HttpGet, Route("/Battles")]
    public async Task<List<Battle>> GetBattles([FromQuery] GetBattlesParameters p)
        => await _battleService.GetAsync(p);

    [HttpGet, Route("/Battle/{id}")]
    public Battle Get(string id)
        => _battleService.Get(new Guid(id));

    [HttpGet, Route("/Battle/{id}/{num}")]
    public async Task<BattleGame> GetBattleGame(string id, string num)
        => await _battleService.GetBattleGameAsync(new Guid(id), int.Parse(num));
}