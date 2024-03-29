﻿using AVA.API.Consumers;
using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using MassTransit;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class AiController : Controller
{
    private readonly IStrategiesService _strategiesService;
    private readonly ISendEndpointProvider _sendEndpointProvider;
    private readonly AVADbContext _dbContext;

    public AiController(IStrategiesService strategiesService,
                        ISendEndpointProvider sendEndpointProvider,
                        AVADbContext dbContext)
    {
        _strategiesService = strategiesService;
        _sendEndpointProvider = sendEndpointProvider;
        _dbContext = dbContext;
    }

    [HttpGet, Route("/getAi/{id}")]
    public async Task<Strategy> getAi(String id)
      => _strategiesService.Get(new Guid(id));

    // TODO Have frontend send stock to test with in uri
    [HttpPost, Route("/Strategy/TestStrategy")]
    public async Task<ActionResult> TestStrategy([FromBody] TestStrategyRequest req)
    {
        var s = req.StrategyToTest;
        var attackGuid = s.Id;
        var defenderGuid = new Guid();
        int selectedStock = req.Stock;

        switch (req.Stock)
        {
            case -1:
                defenderGuid = new Guid("27961240-5173-4a3d-860e-d4f2b236d35c");
                break;
            case -2:
                defenderGuid = new Guid("ff567412-30a5-444c-9ff8-437eda8a73a7");
                break;
            case -3:
                defenderGuid = new Guid("ecce68c3-9ce0-466c-a7b5-5bf7affd5189");
                break;
            default:
                throw new InvalidOperationException("The Stock property must be -1, -2, or -3 for EasyAI, MediumAI, and HardAI respectively.");
        }

        var defendingStrategy = _dbContext.Strategies
            .FirstOrDefault(s => s.Id == defenderGuid);

        var request = new SimulationRequest
        {
            PendingBattle = new Battle
            {
                Id = Guid.NewGuid(),
                Name = s.Name + " vs " + defendingStrategy.Name,
                BattleStatus = BattleStatus.Pending,
                Iterations = 1,
                AttackingStrategyId = attackGuid,
                AttackingStrategy = new Strategy
                {
                    Id = attackGuid,
                    Name = s.Name,
                    Status = StrategyStatus.Active,
                    SourceCode = s.SourceCode
                },
                DefendingStrategyId = defendingStrategy.Id,
                DefendingStrategy = defendingStrategy,
                IsTestSubmission = true
            },
            ClientId = req.ClientId
        };

        var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationRequests"));
        await endpoint.Send(request);

        return Ok("Simulation request sent.");
    }

    [HttpGet, Route("/Strategy/TestPublish")]
    public async Task<ActionResult> TestPublish()
    {
        var easy = _dbContext.Strategies
            .FirstOrDefault(s => s.Id == new Guid("27961240-5173-4a3d-860e-d4f2b236d35c"));

        var medium = _dbContext.Strategies
            .FirstOrDefault(s => s.Id == new Guid("ff567412-30a5-444c-9ff8-437eda8a73a7"));

        var request = new SimulationRequest
        {
            PendingBattle = new Battle
            {
                Id = Guid.NewGuid(),
                Name = "Stock Easy AI vs Stock Medium AI",
                BattleStatus = BattleStatus.Pending,
                Iterations = 9,
                AttackingStrategyId = easy.Id,
                AttackingStrategy = easy,
                DefendingStrategyId = medium.Id,
                DefendingStrategy = medium
            }
        };

        var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationRequests"));
        await endpoint.Send(request);

        return Ok("Simulation request sent.");
    }

    [HttpDelete, Route("/Strategy/Delete/{id}")]
    public async Task<Strategy> Delete(String id)
        => await _strategiesService.DeleteAsync(new Guid(id));

    [HttpGet, Route("/Strategy/ChangePrivate/{id}")]

    public async Task<Strategy> ChangePrivate(String Id)
    {
        Guid StratId = new Guid(Id);

        Strategy strat = _strategiesService.Get(StratId);

        strat.IsPrivate = !strat.IsPrivate;

        await _strategiesService.UpdateAsync(strat);

        return strat;
    }
    public class TestStrategyRequest
    {
        public Strategy StrategyToTest { get; set; }
        public int Stock { get; set; }
        public String ClientId { get; set; }
    }
}