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

    [HttpPost, Route("/Strategy/TestPublish")]
    public async Task<ActionResult> TestPublish([FromBody] Strategy s)
    {
        var attackGuid = s.Id;
        var defendGuid = Guid.NewGuid();

        var request = new SimulationRequest
        {
            PendingBattle = new Battle
            {
                Id = Guid.NewGuid(),
                Name = "Test Publish",
                BattleStatus = BattleStatus.Pending,
                Iterations = 9,
                AttackingStrategyId = attackGuid,
                AttackingStrategy = new Strategy
                {
                    Id = attackGuid,
                    Name = s.Name,
                    Status = StrategyStatus.Active,
                    SourceCode = s.SourceCode
                },
                DefendingStrategyId = defendGuid,
                DefendingStrategy = new Strategy
                {
                    Id = defendGuid,
                    Name = "Stock Defender",
                    Status = StrategyStatus.Active,
                    SourceCode = null//"function getMove() { return 'A8, A7' }"
                }
            }
        };

        var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationRequests"));
        await endpoint.Send(request);

        return Ok("Simulation request sent.");
    }
}