using AVA.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AVA.API.Controllers;

public class HeartbeatController : Controller
{
    private readonly AVASettings _settings;
    public HeartbeatController(IOptions<AVASettings> settings) : base()
    {
        _settings = settings.Value;
    }

    [Route("/Heartbeat")]
    public ActionResult Heartbeat()
    {
        return Ok("Server is up! :)");
    }

    [Route("/Spec")]
    public ActionResult Specification()
    {
        var desc = new
        {
            ApiVersion = "v1",
            BackendVersion = _settings.Version
        };
        return Ok(desc);
    }
}