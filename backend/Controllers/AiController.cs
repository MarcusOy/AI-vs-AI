using Microsoft.AspNetCore.Mvc;

namespace DefaultNamespace;

public class AiController : Controller
{
    [Route("/getAi")]
    public ActionResult getAi(Guid id)
    {
        // The incoming message will be a strategy's id to send the code from
        
        // TODO - Send the ai code to the client

        return Ok("AI code goes here");
    }
}