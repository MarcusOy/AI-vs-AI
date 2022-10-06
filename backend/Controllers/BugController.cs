using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class BugController : Controller
{

    private readonly IBugsService _bugsService;

    public BugController(IBugsService bugsService) : base()
    {
        _bugsService = bugsService;
    }

    [HttpPost, Route("/sendBug")]
    public async Task<ActionResult> sendBug([FromBody] BugReport b)
    {
        // The incomming message should be a bug object that will be sent to the database

        var ret = await _bugsService.CreateAsync(b);

        return Ok(ret);
    }
}