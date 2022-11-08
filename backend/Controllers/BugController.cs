using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class BugController : Controller
{

    private readonly IBugsService _bugsService;

    public BugController(IBugsService bugsService) : base()
    {
        _bugsService = bugsService;
    }

    [HttpPost, Route("/BugReport"), Authorize]
    public async Task<BugReport> Create([FromBody] BugReport b)
        => await _bugsService.CreateAsync(b);
}