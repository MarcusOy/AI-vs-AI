using Microsoft.AspNetCore.Mvc;

namespace DefaultNamespace;

public class BugController : Controller
{
    [Route("/sendBug")]
    public ActionResult sendBug(Bug b)
    {
        // The incomming message should be a bug object that will be sent to the database
        
        // TODO - send the bug report to the database

        return Ok("Bug Report Recieved");
        ;
    }
}