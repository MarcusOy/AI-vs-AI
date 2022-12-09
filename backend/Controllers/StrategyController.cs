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
    private readonly IStarterCodeService _starterCodeService;
    public StrategyController(IStrategiesService strategiesService,
                                AVADbContext dbContext,
                                IHubContext<SimulationHub> hubContext,
                                ISendEndpointProvider sendEndpointProvider,
                                IIdentityService idService,
                                IBattlesService battlesService,
                                IStarterCodeService starterCodeService)
    {
        _strategyService = strategiesService;
        _dbContext = dbContext;
        _hubContext = hubContext;
        _sendEndpointProvider = sendEndpointProvider;
        _idService = idService;
        _battleService = battlesService;
        _starterCodeService = starterCodeService;
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

    // [HttpPost, Route("/Strategy/Submit/{id}"), Authorize]
    // public async Task<Strategy> Submit(Guid id)
    //     => await _strategyService.SubmitAsync(id);

    [HttpPost, Route("/Strategy/Submit/{id}"), Authorize]
    public async Task<Strategy> Submit(Guid id)
    {
        Strategy strat = _dbContext.Strategies
                            .Where(s => s.Status == StrategyStatus.Draft)
                            .Where(s => s.CreatedByUserId == _idService.CurrentUser.Id)
                            .AsNoTracking()
                            .FirstOrDefault(st => st.Id == id);

        if (strat is null)
            throw new InvalidOperationException("Strategy id is not valid.");

        await RunBattles(strat.GameId, strat);

        return strat;
    }

    [HttpPost, Route("/Strategy/Unsubmit/{id}"), Authorize]
    public async Task<Strategy> Unsubmit(Guid id)
    {
        var strat = _dbContext.Strategies
                    .Where(s => s.Status == StrategyStatus.Active)
                    .Where(s => s.CreatedByUserId == _idService.CurrentUser.Id)
                    .FirstOrDefault(st => st.Id == id);

        if (strat is null)
            throw new InvalidOperationException("Strategy id is not valid.");

        strat.Status = StrategyStatus.InActive;
        strat = await _strategyService.UpdateAsync(strat);
        _dbContext.ChangeTracker.Clear();

        var newStrat = new Strategy
        {
            Name = strat.Name,
            Language = strat.Language,
            SourceCode = strat.SourceCode,
            Status = StrategyStatus.Draft,
            Version = strat.Version + 1,
            IsPrivate = strat.IsPrivate,
            Elo = 0,
            CreatedByUserId = _idService.CurrentUser.Id,
            GameId = strat.GameId,
            CreatedOn = strat.CreatedOn
        };

        await _dbContext.Strategies.AddAsync(newStrat);
        newStrat.CreatedOn = strat.CreatedOn;
        // _dbContext.Strategies.Update(newStrat);
        await _dbContext.SaveChangesAsync();

        return newStrat;
    }

    [HttpPut, Route("/Strategy/Delete/{id}"), Authorize]
    public async Task<Strategy> Delete(String id)
        => await _strategyService.DeleteAsync(new Guid(id));


    // stockToChoose (-1 = EasyAI   -2 = MedAI   -3 = HardAI)
    [HttpGet, Route("/Strategy/GetStock/{stockToChoose}"), Authorize]
    public Strategy GetStockStrategy(String stockToChoose)
    {
        return _strategyService.GetStockStrategy(int.Parse(stockToChoose));
    }

    public async Task<String> RunBattles(int gameId, Strategy attackingStrat)
    {
        using var transaction = _dbContext.Database.BeginTransaction();
        attackingStrat.Status = StrategyStatus.Active;
        attackingStrat.Elo = 0;
        attackingStrat = await _strategyService.UpdateAsync(attackingStrat);
        _dbContext.ChangeTracker.Clear();

        var allOtherValidOpponents = await _dbContext.Strategies
            .Where(s => s.Status == StrategyStatus.Active)
            .Where(s => s.CreatedByUserId != _idService.CurrentUser.Id)
            .Where(s => s.GameId == gameId)
            .Where(s => s.Name != "Stock Easy AI (Java)"
                && s.Name != "Stock Medium AI (Java)"
                && s.Name != "Stock Hard AI (Java)")
            .AsNoTracking()
            .ToListAsync();

        var reqQueue = new List<SimulationRequest>();

        if (allOtherValidOpponents.Count == 0)
        {
            Console.WriteLine("No other strategies to play.");
            return "OK";
        }

        foreach (var defendingStrat in allOtherValidOpponents)
        {
            Battle newBattle = new Battle
            {
                Id = Guid.NewGuid(),
                Name = attackingStrat.Name + " vs. " + defendingStrat.Name,
                BattleStatus = BattleStatus.Pending,
                Iterations = 3,
                IsTestSubmission = false,
                AttackingStrategyId = attackingStrat.Id,
                AttackingStrategySnapshot = await _starterCodeService.BuildStrategySource(attackingStrat),
                DefendingStrategyId = defendingStrat.Id,
                DefendingStrategySnapshot = await _starterCodeService.BuildStrategySource(defendingStrat),
            };


            await _dbContext.Battles.AddAsync(newBattle);
            await _dbContext.SaveChangesAsync();


            reqQueue.Add(new SimulationRequest { PendingBattle = newBattle });
        }

        var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationRequests"));
        foreach (var req in reqQueue)
        {
            req.PendingBattle.AttackingStrategy = null;
            req.PendingBattle.DefendingStrategy = null;
            await endpoint.Send(req);
        }

        transaction.Commit();

        return "OK";
    }

    public class SimulationRequest
    {
        public Battle PendingBattle { get; set; }
        public string ClientId { get; set; }
    }
}
