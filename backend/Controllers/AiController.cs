using AVA.API.Consumers;
using AVA.API.Models;
using AVA.API.Services;
using MassTransit;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class AiController : Controller
{
    private readonly IStrategiesService _strategiesService;
    private readonly ISendEndpointProvider _sendEndpointProvider;

    public AiController(IStrategiesService strategiesService,
                        ISendEndpointProvider sendEndpointProvider)
    {
        _strategiesService = strategiesService;
        _sendEndpointProvider = sendEndpointProvider;
    }

    [HttpGet, Route("/getAi/{id}")]
    public async Task<Strategy> getAi(String id)
      => _strategiesService.Get(new Guid(id));
    [HttpGet, Route("/Strategy/TestPublish/{strategyId}/{strategySource}")]
    public async Task<ActionResult> TestPublish(String strategyId, String strategySource)
    {
        var attackGuid = new Guid(strategyId);
        var defendGuid = Guid.NewGuid();

        var request = new SimulationRequest
        {
            PendingBattle = new Battle
            {
                Id = Guid.NewGuid(),
                Name = "Test Publish",
                BattleStatus = BattleStatus.Pending,
                Iterations = 49,
                AttackingStrategyId = attackGuid,
                AttackingStrategy = new Strategy
                {
                    Id = attackGuid,
                    Name = "Test Attacker",
                    Status = StrategyStatus.Active,
                    SourceCode = strategySource
                },
                DefendingStrategyId = defendGuid,
                DefendingStrategy = new Strategy
                {
                    Id = defendGuid,
                    Name = "Stock Defender",
                    Status = StrategyStatus.Active,
                    SourceCode = "function getMove() { return 'A8, A7' }"
                }
            }
        };

        var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationRequests"));
        await endpoint.Send(request);

        return Ok("Simulation request sent.");
    }
}