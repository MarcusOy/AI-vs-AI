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
    public class SimulationStepResponsesConsumer : IConsumer<SimulationStepResponse>
    {
        private readonly ILogger<SimulationStepResponsesConsumer> _logger;
        private readonly IHubContext<SimulationStepHub> _hubContext;
        public SimulationStepResponsesConsumer(ILogger<SimulationStepResponsesConsumer> logger,
                                      IHubContext<SimulationStepHub> hubContext)
        {
            _logger = logger;
            _hubContext = hubContext;
        }

        public async Task Consume(ConsumeContext<SimulationStepResponse> context)
        {
            try
            {
                _logger.LogInformation($"Received step from simluation service for client {context.Message.ClientId}.");
                await _hubContext.Clients.Client(context.Message.ClientId).SendAsync("StepResponse", context.Message);
                _logger.LogInformation($"Sent simulation step to client successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"The resulting step could not be sent back to client {context.Message.ClientId}.");
                _logger.LogError(ex.Message);
            }
        }
    }

    public class SimulationStepResponse
    {
        public String[][] ResultingBoard { get; set; }
        public String MoveString { get; set; }

        public bool IsGameOver { get; set; } // determines if one of the players won, and which
        public bool? DidAttackerWin { get; set; } // didplayerwin?
        public String ClientId { get; set; }
    }
}