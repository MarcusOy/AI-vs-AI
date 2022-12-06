using AVA.API.Consumers;
using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using AVA.API.Hubs;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace AVA.API.Controllers;

public class AiController : Controller
{
    private readonly IStrategiesService _strategiesService;
    private readonly ISendEndpointProvider _sendEndpointProvider;
    private readonly AVADbContext _dbContext;
    private readonly IHubContext<SimulationHub> _hubContext;

    public AiController(IStrategiesService strategiesService,
                        ISendEndpointProvider sendEndpointProvider,
                        AVADbContext dbContext,
                        IHubContext<SimulationHub> hubContext)
    {
        _strategiesService = strategiesService;
        _sendEndpointProvider = sendEndpointProvider;
        _dbContext = dbContext;
        _hubContext = hubContext;
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

    [HttpPost, Route("/Strategy/StepRun/{ClientId}/{StockId}")]
    public async void SimulationStep(String ClientId, Guid StockId, [FromBody] String[][] board) {
        SimulationHub.SimulationStepRequest newStep = new SimulationHub.SimulationStepRequest();
        newStep.SentBoard = board;
        newStep.IsWhiteAI = true;
        newStep.ClientId = ClientId;
        newStep.ChosenStockId = StockId;

        await _hubContext.Clients.Client(ClientId).SendAsync("StepRequest", newStep);
    }
    public class TestStrategyRequest
    {
        public Strategy StrategyToTest { get; set; }
        public int Stock { get; set; }
        public String ClientId { get; set; }
    }

    // public class SimulationStepRequest
    //     {
    //         public String[][] SentBoard { get; set; }
    //         public bool IsWhiteAI { get; set; }
    //         public String ClientId { get; set; }
    //         public Guid ChosenStockId { get; set; }
    //     }
}