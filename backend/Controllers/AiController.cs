using AVA.API.Consumers;
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

    [HttpGet, Route("/Strategy/TestPublish")]
    public async Task<ActionResult> TestPublish()
    {
        var strategy = _dbContext.Strategies
            .FirstOrDefault(s => s.Id == new Guid("27961240-5173-4a3d-860e-d4f2b236d35c"));

        var request = new SimulationRequest
        {
            PendingBattle = new Battle
            {
                Id = Guid.NewGuid(),
                Name = "Stock Easy AI vs Stock Easy AI",
                BattleStatus = BattleStatus.Pending,
                Iterations = 9,
                AttackingStrategyId = new Guid("27961240-5173-4a3d-860e-d4f2b236d35c"),
                AttackingStrategy = strategy,
                DefendingStrategyId = new Guid("27961240-5173-4a3d-860e-d4f2b236d35c"),
                DefendingStrategy = strategy
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
}