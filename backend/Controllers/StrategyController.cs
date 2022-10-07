using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class StrategyController : Controller
{
    private readonly IStrategiesService _strategyService;

    public StrategyController(IStrategiesService strategiesService)
    {
        _strategyService = strategiesService;
    }

    [HttpPut, Route("/Strategy")]
    public async Task<ActionResult> Create([FromBody] Strategy s)
    {
        var ret = await _strategyService.CreateAsync(s);

        return Ok(ret);
    }

    [HttpPost, Route("/Stategy")]
    public async Task<ActionResult> Update(Strategy s)
    {
        var ret = await _strategyService.UpdateAsync(s);

        return Ok(ret);
    }

}