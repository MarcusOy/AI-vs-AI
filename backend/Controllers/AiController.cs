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

    // TODO Have frontend send stock to test with in uri
    [HttpPost, Route("/Strategy/TestStrategy/{stock}")]
    public async Task<ActionResult> TestStrategy([FromBody] Strategy s, String stock)
    {
        var attackGuid = s.Id;
        int selectedStock = 0;

        try
        {
            selectedStock = int.Parse(stock);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"StockCodeInteger of {stock} is invalid.  {ex.Message}");
        }

        if (selectedStock < -3 || selectedStock > -1)
        {
            throw new InvalidOperationException("Must pass an integer from -3 to -1 to /Strategy/TestStrategy/{stock}.");
        }

        string stockName = _strategiesService.getStockName(selectedStock);
        var defendGuid = _strategiesService.getStockGuid(selectedStock);

        var request = new SimulationRequest
        {
            PendingBattle = new Battle
            {
                Id = Guid.NewGuid(),
                Name = s.Name + " vs " + stockName,
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
                DefendingStrategyId = defendGuid,
                DefendingStrategy = new Strategy
                {
                    Id = defendGuid,
                    Name = stockName,
                    Status = StrategyStatus.Active,
                    Version = selectedStock,
                    SourceCode = null
                }
            }
        };

        var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationRequests"));
        await endpoint.Send(request);

        return Ok("Simulation request sent.");
    }

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
                    SourceCode = "function getMove() { return 'A8, A7' }"
                }
            }
        };

        var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationRequests"));
        await endpoint.Send(request);

        return Ok("Simulation request sent.");
    }
}