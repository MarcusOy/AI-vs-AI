using System;
using System.Threading.Tasks;
using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace AVA.API.Hubs
{
    public class SimulationHub : Hub
    {
        private readonly ILogger<SimulationHub> _logger;
        private readonly ISendEndpointProvider _sendEndpointProvider;

        public SimulationHub(ISendEndpointProvider sendEndpointProvider,
                                 ILogger<SimulationHub> logger)
        {
            _sendEndpointProvider = sendEndpointProvider;
            _logger = logger;
        }

        public async Task StepRequest(SimulationStepRequest request)
        {

            _logger.LogInformation($"Simulation step received. Sending to simulation service... {request.ClientId}");
            await Task.Delay(1000);
            var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationStepRequests"));
            await endpoint.Send(request);
        }

        public class SimulationStepRequest
        {
            public String[][] SentBoard { get; set; }
            public bool IsWhiteTurn { get; set; }
            public String ClientId { get; set; }
            public Guid StrategyId { get; set; }
            public String StrategySnapshot { get; set; }
        }

    }
}