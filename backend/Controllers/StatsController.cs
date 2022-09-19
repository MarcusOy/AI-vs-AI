using Microsoft.AspNetCore.Mvc;

namespace DefaultNamespace;

public class StatsController : Controller
{
    [Route("/getStats")]
    public ActionResult getStats(Battle b)
    {
        // The incoming message will be the battle to display the stats from. This may change
        
        // TODO - retrieve stats from the database, and send it to the client

        return Ok("Stats goes here");
    }
}