using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class GameController : Controller
{
    private readonly IGamesService _gamesService;
    public GameController(IGamesService gamesService) : base()
    {
        _gamesService = gamesService;
    }

    [HttpGet, Route("/Games")]
    public List<Game> GetAll()
        => _gamesService.GetAll();

    [HttpGet, Route("/Games/{id}")]
    public Game Get(int id)
        => _gamesService.Get(id);

    [HttpPut, Route("/Games")]
    public async Task<Game> Create([FromBody] Game game)
        => await _gamesService.CreateAsync(game);

    [HttpPost, Route("/Games")]
    public async Task<Game> Update([FromBody] Game game)
        => await _gamesService.UpdateAsync(game);

    [HttpDelete, Route("/Games/{id}")]
    public async Task<Game> Delete(int id)
        => await _gamesService.DeleteAsync(id);
}