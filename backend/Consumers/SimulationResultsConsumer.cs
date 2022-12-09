using System;
using System.Threading.Tasks;
using AVA.API.Data;
using AVA.API.Hubs;
using AVA.API.Models;
using AVA.API.Services;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace AVA.API.Consumers
{
    public class SimulationResponsesConsumer : IConsumer<SimulationResponse>
    {
        private readonly ILogger<SimulationResponsesConsumer> _logger;
        private readonly IBattlesService _battleService;
        private readonly IHubContext<SimulationHub> _hubContext;
        private readonly IStrategiesService _strategyService;
        private readonly AVADbContext _dbContext;

        public SimulationResponsesConsumer(ILogger<SimulationResponsesConsumer> logger,
                                         IBattlesService battleService,
                                         IHubContext<SimulationHub> hubContext,
                                         IStrategiesService strategiesService,
                                         AVADbContext dbContext)
        {
            _logger = logger;
            _battleService = battleService;
            _hubContext = hubContext;
            _strategyService = strategiesService;
            _dbContext = dbContext;
        }

        public async Task Consume(ConsumeContext<SimulationResponse> context)
        {
            Console.WriteLine("CONSUME");
            // Save Battle to database
            try
            {
                _logger.LogInformation($"Simulation result recieved. {context.Message.ResultingBattle.Name}");
                _logger.LogInformation(JsonConvert.SerializeObject(context.Message.ResultingBattle, Formatting.Indented));

                _logger.LogInformation($"Saving resulting battle... {context.Message.ResultingBattle.Name}");
                if (context.Message.ResultingBattle.IsTestSubmission)
                {
                    context.Message.ResultingBattle.AttackingStrategy = null;
                    context.Message.ResultingBattle.DefendingStrategy = null;
                    await _battleService.CreateAsync(context.Message.ResultingBattle);
                }
                else
                {
                    await _battleService.UpdateAsync(context.Message.ResultingBattle);
                    _dbContext.ChangeTracker.Clear();
                }
                _logger.LogInformation($"Resulting battle has been saved. {context.Message.ResultingBattle.Name}");
            }
            catch (Exception ex)
            {
                _logger.LogError("The resulting battle could not be saved.");
                _logger.LogError(ex.Message);
            }

            // Send Battle back to client if IsTestSubmission
            try
            {
                if (context.Message.ResultingBattle.IsTestSubmission
                    && context.Message.ClientId is not null)
                {
                    // strip parent Battle navigation property from each Battlegame
                    for (int x = 0; x < context.Message.ResultingBattle.BattleGames.Count; x++)
                        context.Message.ResultingBattle.BattleGames[x].Battle = null;

                    _logger.LogInformation($"Sending test submission battle to client {context.Message.ClientId}...");
                    await _hubContext.Clients.Client(context.Message.ClientId).SendAsync("TestSubmissionResult", context.Message);
                    _logger.LogInformation($"Sent test submission battle to client successfully.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("The resulting test submission battle could not be sent back to the client.");
                _logger.LogError(ex.Message);
            }

            if (!context.Message.ResultingBattle.IsTestSubmission)
            {
                var BattleListQuery = _dbContext.Battles
                    .Where(b => b.BattleStatus == BattleStatus.Success && !b.IsTestSubmission)
                    .AsNoTracking();

                List<Battle> BattleList = await BattleListQuery.ToListAsync();

                foreach (Battle bt in BattleList)
                {
                    Guid AttackerId = bt.AttackingStrategyId;
                    Guid DefenderId = bt.DefendingStrategyId;

                    Strategy attacker = _dbContext.Strategies
                                            .FirstOrDefault(sa => sa.Id == AttackerId);

                    Strategy defender = _dbContext.Strategies
                                            .FirstOrDefault(sd => sd.Id == DefenderId);

                    if (attacker.Status == StrategyStatus.Active && defender.Status == StrategyStatus.Active)
                    {
                        int AttackerEloGen1 = bt.AttackerWins;
                        int DefenderEloGen1 = bt.DefenderWins;

                        int TotAttackerWins = 0;
                        int TotDefenderWins = 0;

                        if (attacker.AttackerBattles != null)
                        {
                            foreach (Battle AttackerAttackWins in attacker.AttackerBattles)
                            {
                                // AttackerAttackWins.AttackingStrategy = null;
                                TotAttackerWins += AttackerAttackWins.AttackerWins;
                            }
                        }

                        if (attacker.DefenderBattles != null)
                        {
                            foreach (Battle AttackerDefenderWins in attacker.DefenderBattles)
                            {
                                // AttackerDefenderWins.DefendingStrategy = null;
                                TotAttackerWins += AttackerDefenderWins.DefenderWins;
                            }
                        }

                        if (defender.AttackerBattles != null)
                        {
                            foreach (Battle DefenderAttackWins in defender.AttackerBattles)
                            {
                                // DefenderAttackWins.AttackingStrategy = null;
                                TotDefenderWins += DefenderAttackWins.AttackerWins;
                            }
                        }

                        if (defender.DefenderBattles != null)
                        {
                            foreach (Battle DefenderDefendWins in defender.DefenderBattles)
                            {
                                // DefenderDefendWins.DefendingStrategy = null;
                                TotDefenderWins += DefenderDefendWins.DefenderWins;
                            }
                        }

                        int AttackerEloGen2 = bt.AttackerWins * TotDefenderWins + 1;
                        int DefenderEloGen2 = bt.DefenderWins * TotAttackerWins + 1;

                        int FinalAttackerElo = AttackerEloGen1 + AttackerEloGen2;
                        int FinalDefenderElo = DefenderEloGen1 + DefenderEloGen2;

                        var newAttacker = _dbContext.Strategies
                                            .AsNoTracking()
                                            .FirstOrDefault(na => na.Id == attacker.Id);

                        var newDefender = _dbContext.Strategies
                                            .AsNoTracking()
                                            .FirstOrDefault(nd => nd.Id == defender.Id);

                        newAttacker.Elo += FinalAttackerElo;
                        newDefender.Elo += FinalDefenderElo;

                        _dbContext.ChangeTracker.Clear();
                        _dbContext.Strategies.Update(newAttacker);
                        _dbContext.Update(newAttacker);
                        _dbContext.Strategies.Update(newDefender);
                        _dbContext.Update(newDefender);
                        await _dbContext.SaveChangesAsync();
                    }
                }

                Strategy GameStrat = _dbContext.Strategies
                                        .AsNoTracking()
                                        .FirstOrDefault(g => g.Id == context.Message.ResultingBattle.AttackingStrategyId);

                var StratQuery = _dbContext.Strategies
                                    .Where(s => s.Status == StrategyStatus.Active && s.GameId == GameStrat.GameId &&
                                    (s.Name != "Stock Easy AI" && s.Name != "Stock Medium AI" && s.Name != "Stock Hard AI"))
                                    .AsNoTracking()
                                    .OrderByDescending(s => s.Elo);

                List<Strategy> StratList = await StratQuery.ToListAsync();

                int mid = StratList.Count / 2;

                for (int x = 0; x < StratList.Count; x++)
                {
                    Strategy tempStrat = StratList.ElementAt(x);
                    tempStrat.Elo = (int)((0.5 + (mid - (x + 1))) * 10) + 1000;

                    var OriginalStrat = _dbContext.Strategies
                                    .AsNoTracking()
                                    .FirstOrDefault(s => s.Id == tempStrat.Id);

                    OriginalStrat.Elo = tempStrat.Elo;
                    _dbContext.ChangeTracker.Clear();
                    _dbContext.Strategies.Update(OriginalStrat);
                    _dbContext.Update(OriginalStrat);
                    await _dbContext.SaveChangesAsync();
                }
            }
        }
    }

    public class SimulationRequest
    {
        public Battle PendingBattle { get; set; }
        public string ClientId { get; set; }
    }

    public class SimulationResponse
    {
        public Battle ResultingBattle { get; set; }
        public string ClientId { get; set; }
    }
}