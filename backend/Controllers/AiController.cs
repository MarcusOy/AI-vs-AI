using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class AiController : Controller
{
	private readonly IStrategiesService _strategiesService;

	public AiController(IStrategiesService strategiesService) : base()
	{
		_strategiesService = strategiesService;
	}

    [HttpPost, Route("/getAi")]
    public async Task<ActionResult> getAi(int id)
    {
        // The incoming message will be a strategy's id to send the code from
        
        var ret = await _strategiesService.Get(id)

        return Ok(ret);
    }
}