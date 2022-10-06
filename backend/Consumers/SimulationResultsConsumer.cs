using System;
using System.Threading.Tasks;
using AVA.API.Data;
using AVA.API.Models;
using MassTransit;
using Newtonsoft.Json;

namespace AVA.API.Consumers
{
    public class SimulationResponsesConsumer : IConsumer<SimulationResponse>
    {
        private readonly ILogger<SimulationResponsesConsumer> _logger;
        private readonly AVADbContext _dbContext;
        public SimulationResponsesConsumer(ILogger<SimulationResponsesConsumer> logger,
                                         AVADbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        public async Task Consume(ConsumeContext<SimulationResponse> context)
        {
            _logger.LogInformation($"Simulation result recieved. {context.Message.ResultingBattle.Name}");
            _logger.LogInformation(JsonConvert.SerializeObject(context.Message.ResultingBattle, Formatting.Indented));
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