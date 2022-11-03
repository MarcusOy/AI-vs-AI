using System;
using System.Threading.Tasks;
using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using MassTransit;
using Newtonsoft.Json;

namespace AVA.API.Consumers
{
    public class SimulationResponsesConsumer : IConsumer<SimulationResponse>
    {
        private readonly ILogger<SimulationResponsesConsumer> _logger;
        private readonly IBattlesService _battleService;
        public SimulationResponsesConsumer(ILogger<SimulationResponsesConsumer> logger,
                                         IBattlesService battleService)
        {
            _logger = logger;
            _battleService = battleService;
        }

        public async Task Consume(ConsumeContext<SimulationResponse> context)
        {
            try
            {
                context.Message.ResultingBattle.AttackingStrategy = null;
                context.Message.ResultingBattle.DefendingStrategy = null;
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
        }
    }

    public class SimulationRequest
    {
        public Battle PendingBattle { get; set; }
    }

    public class SimulationResponse
    {
        public Battle ResultingBattle { get; set; }
    }
}