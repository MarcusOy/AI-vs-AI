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

    [HttpPut, Route("/Strategy/Duplicate/{id}"), Authorize]
    public async Task<Strategy> Duplicate([FromBody] Strategy s, String id)
    {
        await _strategyService.DeleteAsync(new Guid(id));
        s.Name = "Duplicate of " + s.Name;
        Console.WriteLine(id);
        Console.WriteLine(s);
        return await _strategyService.CreateAsync(s);
    }

    [HttpPost, Route("/Strategy/Submit/{id}"), Authorize]
    public async Task<Strategy> Submit(Guid id)
        => await _strategyService.SubmitAsync(id);


    [HttpPut, Route("/Strategy/Delete/{id}"), Authorize]
    public async Task<Strategy> Delete(String id)
        => await _strategyService.DeleteAsync(new Guid(id));


    // stockToChoose (-1 = EasyAI   -2 = MedAI   -3 = HardAI)
    [HttpGet, Route("/Strategy/GetStock/{stockToChoose}"), Authorize]
    public Strategy GetStockStrategy(String stockToChoose)
    {
        return _strategyService.GetStockStrategy(int.Parse(stockToChoose));
    }
}