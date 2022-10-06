using System;
using System.Threading.Tasks;
using AVA.API.Data;
using AVA.API.Models;
using MassTransit;
using Newtonsoft.Json;

namespace AVA.API.Consumers
{
    public class SimulationResultsConsumer : IConsumer<SimulationResult>
    {
        private readonly ILogger<SimulationResultsConsumer> _logger;
        private readonly AVADbContext _dbContext;
        public SimulationResultsConsumer(ILogger<SimulationResultsConsumer> logger,
                                         AVADbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        public async Task Consume(ConsumeContext<SimulationResult> context)
        {
            _logger.LogInformation($"Simulation result recieved. {context.Message.ResultingBattle.Name}");
        }
    }

    public class SimulationRequest
    {
        public Battle PendingBattle { get; set; }
    }

    public class SimulationResult
    {
        public Battle ResultingBattle { get; set; }
    }
}