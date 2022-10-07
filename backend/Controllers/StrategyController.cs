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

    [HttpPut, Route("/Strategy"), Authorize]
    public async Task<Strategy> Create([FromBody] Strategy s)
        => await _strategyService.CreateAsync(s);

    [HttpPost, Route("/Stategy"), Authorize]
    public async Task<Strategy> Update([FromBody] Strategy s)
        => await _strategyService.UpdateAsync(s);

}