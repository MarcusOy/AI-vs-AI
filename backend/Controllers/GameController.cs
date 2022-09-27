using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AVA.API.Controllers;

public class GameController : Controller
{
    private readonly AVADbContext _dbContext;
    public GameController(AVADbContext dbContext) : base()
    {
        _dbContext = dbContext;
    }

    [HttpGet, Route("/Games")]
    public List<Game> Get()
    {
        return _dbContext.Games
            .Where(g => g.DeletedOn == null)
            .ToList();
    }

    [HttpGet, Route("/Games/{id}")]
    public Game Get(int id)
    {
        return _dbContext.Games
            .Where(g => g.DeletedOn == null)
            .FirstOrDefault(g => g.Id == id);
    }


    // [HttpPost, Route("/Games")]
    // public Game Get([FromBody] Game game)
    // {
    //     return game;
    // }
}