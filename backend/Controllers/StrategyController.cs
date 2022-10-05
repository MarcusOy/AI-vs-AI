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

    [HttpPost, Route("/createStrat")]
    public async Task<ActionResult> createStrat(Strategy s)
    {
        var ret = await _strategyService.CreateAsync(s);

        return Ok(ret);
    }

    [HttpPost, Route("/updateStrat")]
    public async Task<ActionResult> updateStrat(Strategy s)
    {
        var ret = await _strategyService.UpdateAsync(s);

        return Ok(ret);
    }

}