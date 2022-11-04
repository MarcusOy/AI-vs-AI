using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class StrategyController : Controller
{
    private readonly IStrategiesService _strategyService;

    public StrategyController(IStrategiesService strategiesService)
    {
        _strategyService = strategiesService;
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

}