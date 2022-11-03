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

    [HttpPut, Route("/Strategy/Update"), Authorize]
    public async Task<Strategy> Update([FromBody] Strategy s)
        => await _strategyService.UpdateAsync(s);

    [HttpPut, Route("/Strategy/Duplicate/{id}"), Authorize]
    public async Task<Strategy> Duplicate([FromBody] Strategy s, String id)
    {
        await _strategyService.DeleteAsync(new Guid(id));
        s.Name = "Duplicate of " + s.Name;
        Console.WriteLine(id);
        Console.WriteLine(s);
        return await _strategyService.CreateAsync(s);
    }

    [HttpPut, Route("/Strategy/Submit"), Authorize]
    public async Task<Strategy> Submit([FromBody] Strategy s)
    {
        return await _strategyService.UpdateAsync(s); ;
    }

    [HttpDelete, Route("/Strategy/Delete/{id}"), Authorize]
    public async Task<Strategy> Delete(String id)
        => await _strategyService.DeleteAsync(new Guid(id));


    // stockToChoose (-1 = EasyAI   -2 = MedAI   -3 = HardAI)
    [HttpGet, Route("/Strategy/GetStock/{stockToChoose}"), Authorize]
    public async Task<Strategy> GetStockStrategy(String stockToChoose) {
        return await _strategyService.GetStockStrategy(int.Parse(stockToChoose));
    }
}