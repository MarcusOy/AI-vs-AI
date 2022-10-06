﻿using AVA.API.Consumers;
using AVA.API.Models;
using AVA.API.Services;
using MassTransit;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class AiController : Controller
{
    private readonly IStrategiesService _strategiesService;
    private readonly ISendEndpointProvider _sendEndpointProvider;

    public AiController(IStrategiesService strategiesService,
                        ISendEndpointProvider sendEndpointProvider)
    {
        _strategiesService = strategiesService;
        _sendEndpointProvider = sendEndpointProvider;
    }

    [HttpPost, Route("/getAi")]
    public async Task<ActionResult> getAi(Guid id)
    {
        // The incoming message will be a strategy's id to send the code from

        var ret = _strategiesService.Get(id);

        return Ok(ret);
    }

    [HttpGet, Route("/Strategy/TestPublish")]
    public async Task<ActionResult> TestPublish()
    {
        var request = new SimulationRequest
        {
            PendingBattle = new Battle
            {
                Id = Guid.NewGuid(),
                Name = "Test Publish",
                BattleStatus = BattleStatus.Pending,
                Iterations = 1000
            }
        };

        var endpoint = await _sendEndpointProvider.GetSendEndpoint(new Uri("queue:SimulationRequests"));
        await endpoint.Send(request);

        return Ok("Simulation request sent.");
    }
}