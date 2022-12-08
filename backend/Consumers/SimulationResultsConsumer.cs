using System;
using System.Threading.Tasks;
using AVA.API.Data;
using AVA.API.Hubs;
using AVA.API.Models;
using AVA.API.Services;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace AVA.API.Consumers
{
    public class SimulationResponsesConsumer : IConsumer<SimulationResponse>
    {
        private readonly ILogger<SimulationResponsesConsumer> _logger;
        private readonly IBattlesService _battleService;
        private readonly IHubContext<SimulationHub> _hubContext;

        public SimulationResponsesConsumer(ILogger<SimulationResponsesConsumer> logger,
                                         IBattlesService battleService,
                                         IHubContext<SimulationHub> hubContext)
        {
            _logger = logger;
            _battleService = battleService;
            _hubContext = hubContext;
        }

        public async Task Consume(ConsumeContext<SimulationResponse> context)
        {
            // Save Battle to database
            var attacker = context.Message.ResultingBattle.AttackingStrategy;
            var defender = context.Message.ResultingBattle.DefendingStrategy;
            context.Message.ResultingBattle.AttackingStrategy = null;
            context.Message.ResultingBattle.DefendingStrategy = null;
            try
            {
                _logger.LogInformation($"Simulation result recieved. {context.Message.ResultingBattle.Name}");
                _logger.LogInformation(JsonConvert.SerializeObject(context.Message.ResultingBattle, Formatting.Indented));

                _logger.LogInformation($"Saving resulting battle... {context.Message.ResultingBattle.Name}");
                await _battleService.CreateAsync(context.Message.ResultingBattle);
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

                    // add back attacker and defender
                    context.Message.ResultingBattle.AttackingStrategy = attacker;
                    context.Message.ResultingBattle.DefendingStrategy = defender;

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