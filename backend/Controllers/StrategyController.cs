using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TypeGen.Core.TypeAnnotations;
using AVA.API.Hubs;
using Microsoft.AspNetCore.SignalR;
using MassTransit;

namespace AVA.API.Controllers;

public class StrategyController : Controller
{
    private readonly IStrategiesService _strategyService;
    private readonly AVADbContext _dbContext;
    private readonly IHubContext<SimulationHub> _hubContext;
    private readonly ISendEndpointProvider _sendEndpointProvider;
    private readonly IIdentityService _idService;
    private readonly IBattlesService _battleService;
    public StrategyController(IStrategiesService strategiesService,
                                AVADbContext dbContext,
                                IHubContext<SimulationHub> hubContext,
                                ISendEndpointProvider sendEndpointProvider,
                                IIdentityService idService,
                                IBattlesService battlesService)
    {
        _strategyService = strategiesService;
        _dbContext = dbContext;
        _hubContext = hubContext;
        _sendEndpointProvider = sendEndpointProvider;
        _idService = idService;
        _battleService = battlesService;
    }
    [HttpGet, Route("/Strategy/{id}"), Authorize]
    public Strategy Get(string id)
        => _strategyService.Get(new Guid(id));

    [HttpPut, Route("/Strategy"), Authorize]
    public async Task<Strategy> Create([FromBody] Strategy s)
    {
        s.IsPrivate = true;
        await _strategyService.CreateAsync(s);

        return s;
    }

    [HttpPut, Route("/Strategy/Update"), Authorize]
    public async Task<Strategy> Update([FromBody] Strategy s)
    {
        Strategy old = _strategyService.Get(s.Id);
        Strategy ret = new Strategy();

        if (old.Status == StrategyStatus.Draft && s.Status == StrategyStatus.Active)
        {
            s.Elo = 0;
            await _strategyService.UpdateAsync(s);
            RunBattles(s.GameId);
            ret = _strategyService.Get(s.Id);
        }
        else
        {
            ret = await _strategyService.UpdateAsync(s);
        }

        return ret;
    }

    [HttpPut, Route("/Strategy/Duplicate/{id}"), Authorize]
    public async Task<Strategy> Duplicate([FromBody] Strategy s, String id)
    {
        await _strategyService.DeleteAsync(new Guid(id));
        s.Name = "Duplicate of " + s.Name;
        Console.WriteLine(id);
        Console.WriteLine(s);
        return await _strategyService.CreateAsync(s);
    }

    [HttpPut, Route("/Strategy/Submit"), Authorize]
    public async Task<Strategy> Submit([FromBody] Strategy s)
    {
        return await _strategyService.SubmitAsync(s);
    }

    [HttpDelete, Route("/Strategy/Delete/{id}"), Authorize]
    public async Task<Strategy> Delete(String id)
        => await _strategyService.DeleteAsync(new Guid(id));


    // stockToChoose (-1 = EasyAI   -2 = MedAI   -3 = HardAI)
    [HttpGet, Route("/Strategy/GetStock/{stockToChoose}"), Authorize]
    public async Task<Strategy> GetStockStrategy(String stockToChoose)
    {
        return _strategyService.GetStockStrategy(int.Parse(stockToChoose));
    }

    public async void RunBattles(int gameId)
    {
        var stratQuery = _dbContext.Strategies
            .Where(s => s.Status == StrategyStatus.Active && s.GameId == gameId);

        List<Strategy> AllStrats = await stratQuery.ToListAsync();

        var Rand = new Random();
        Strategy attacking = new Strategy();
        Strategy defending = new Strategy();
        var req = new SimulationRequest();
        Guid oldBattleId = new Guid();

        for (int i = 0; i < AllStrats.Capacity; i++)
        {
            for (int j = i; j < AllStrats.Capacity; j++)
            {
                int attacker = Rand.Next(100);

                if (attacker < 50)
                {
                    attacking = AllStrats.ElementAt(i);
                    defending = AllStrats.ElementAt(j);
                }
                else
                {
                    attacking = AllStrats.ElementAt(j);
                    defending = AllStrats.ElementAt(i);
                }

                req = new SimulationRequest
                {
                    PendingBattle = new Battle
                    {
                        Id = Guid.NewGuid(),
                        Name = new String(attacking.Name + " Attacks " + defending.Name + " in a Random Battle"),
                        BattleStatus = BattleStatus.Pending,
                        Iterations = 99,
                        AttackingStrategyId = attacking.Id,
                        AttackingStrategy = attacking,
                        DefendingStrategyId = defending.Id,
                        DefendingStrategy = defending
                    },
                    ClientId = _idService.CurrentUser.ToString()
                };

                var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationRequests"));
                await endpoint.Send(req);
                oldBattleId = req.PendingBattle.Id;
            }
        }

        while (_battleService.Get(oldBattleId).BattleStatus == BattleStatus.Pending)
        {
            await Task.Delay(1000);
        }

        var NewStratQuery = _dbContext.Strategies
            .Where(s => s.Status == StrategyStatus.Active && s.GameId == gameId)
            .OrderByDescending(s => s.Elo);

        List<Strategy> OrderedStrats = await NewStratQuery.ToListAsync();

        int mid = OrderedStrats.Capacity / 2;
        Strategy tempStrat = new Strategy();

        for (int x = 0; x < OrderedStrats.Capacity; x++)
        {
            tempStrat = OrderedStrats.ElementAt(x);
            tempStrat.Elo = (int)((0.5 + (mid - x)) * 10) + 1000;
            await _strategyService.UpdateAsync(tempStrat);
        }
    }

    public class SimulationRequest
    {
        public Battle PendingBattle { get; set; }
        public string ClientId { get; set; }
    }
}