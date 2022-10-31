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
    public class SimulationStepHub : Hub
    {
        private readonly ISendEndpointProvider _sendEndpointProvider;

        public SimulationStepHub(ISendEndpointProvider sendEndpointProvider)
        {
            _sendEndpointProvider = sendEndpointProvider;
        }

        public async Task RequestStep(SimulationStepRequest request)
        {
            var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationRequests"));
            await endpoint.Send(request);
        }

        public async Task ResponseStep(SimulationStepResponse response)
            => await Clients.Client(response.ClientId).SendAsync("responseStep", response);


    }

    public class SimulationStepRequest
    {
        public String[][] SentBoard { get; set; }
        public bool IsWhiteAI { get; set; }
        public String ClientId { get; set; }
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