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
        => await _strategyService.UpdateAsync(s);

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
        Strategy strat = _dbContext.Strategies
                            .AsNoTracking()
                            .FirstOrDefault(st => st.Id == s.Id);

        strat.Status = StrategyStatus.Active;
        strat.Elo = 0;
        strat = await _strategyService.UpdateAsync(strat);
        _dbContext.ChangeTracker.Clear();
        await RunBattles(strat.GameId, strat);

        return strat;
    }

    [HttpPut, Route("/Strategy/Delete/{id}"), Authorize]
    public async Task<Strategy> Delete(String id)
        => await _strategyService.DeleteAsync(new Guid(id));


    // stockToChoose (-1 = EasyAI   -2 = MedAI   -3 = HardAI)
    [HttpGet, Route("/Strategy/GetStock/{stockToChoose}"), Authorize]
    public async Task<Strategy> GetStockStrategy(String stockToChoose)
    {
        return _strategyService.GetStockStrategy(int.Parse(stockToChoose));
    }

    public async Task<String> RunBattles(int gameId, Strategy strat)
    {
        var stratQuery = _dbContext.Strategies
            .Where(s => s.Status == StrategyStatus.Active && s.GameId == gameId &&
            (s.Name != "Stock Easy AI" && s.Name != "Stock Medium AI" && s.Name != "Stock Hard AI"))
            .AsNoTracking();

        List<Strategy> AllStrats = await stratQuery.AsNoTracking().ToListAsync();

        if (AllStrats.Count == 1)
        {
            Console.WriteLine("Only 1 strategy");
            return "OK";
        }

        // foreach (Strategy st in AllStrats)
        // {
        //     Strategy t = _dbContext.Strategies
        //                     .AsNoTracking()
        //                     .FirstOrDefault(str => str.Id == st.Id);
        //     t.Elo = 0;

        //     _dbContext.Strategies.Update(t);
        //     await _dbContext.SaveChangesAsync();
        // }

        for (int j = 0; j < AllStrats.Count; j++)
        {
            var attacking = _dbContext.Strategies
                                .FirstOrDefault(s => s.Id == strat.Id);

            var defending = _dbContext.Strategies
                                .FirstOrDefault(s => s.Id == AllStrats.ElementAt(j).Id);

            if (attacking.Id != AllStrats.ElementAt(j).Id)
            {

                Guid newId = Guid.NewGuid();
                String newName = new String(attacking.Name + " Attacks " + defending.Name + " in a Random Battle");

                var req = new SimulationRequest
                {
                    PendingBattle = new Battle
                    {
                        Id = newId,
                        Name = newName,
                        BattleStatus = BattleStatus.Pending,
                        Iterations = 1,
                        IsTestSubmission = false,
                        AttackingStrategyId = attacking.Id,
                        AttackingStrategy = attacking,
                        DefendingStrategyId = defending.Id,
                        DefendingStrategy = defending
                    }
                };

                Battle newBattle = new Battle
                {
                    Id = newId,
                    Name = newName,
                    BattleStatus = BattleStatus.Pending,
                    Iterations = 1,
                    IsTestSubmission = false,
                    AttackingStrategyId = attacking.Id,
                    AttackingStrategy = attacking,
                    DefendingStrategyId = defending.Id,
                    DefendingStrategy = defending
                };

                // await _dbContext.Battles.AddAsync(newBattle);
                // await _dbContext.SaveChangesAsync();
                // _dbContext.ChangeTracker.Clear();

                await _battleService.CreateAsync(newBattle);
                _dbContext.ChangeTracker.Clear();

                req.PendingBattle.AttackingStrategy.CreatedByUser = null;
                req.PendingBattle.DefendingStrategy.CreatedByUser = null;
                // req.PendingBattle.AttackingStrategy.Game.Strategies = null;
                // req.PendingBattle.DefendingStrategy.Game.Strategies = null;
                req.PendingBattle.AttackingStrategy.AttackerBattles = null;
                req.PendingBattle.DefendingStrategy.AttackerBattles = null;
                req.PendingBattle.AttackingStrategy.DefenderBattles = null;
                req.PendingBattle.DefendingStrategy.DefenderBattles = null;

                var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationRequests"));
                await endpoint.Send(req);
            }
        }

        return "OK";
    }

    public class SimulationRequest
    {
        public Battle PendingBattle { get; set; }
        public string ClientId { get; set; }
    }
}