using Microsoft.AspNetCore.Mvc;

namespace Snappy.API.Controllers;

public class HeartbeatController : Controller
{
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
            DownloadEndpoint = "tbd"
        };
        return Ok(desc);
    }
}