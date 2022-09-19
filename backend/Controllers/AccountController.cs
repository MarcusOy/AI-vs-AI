using Microsoft.AspNetCore.Mvc;

namespace DefaultNamespace;

public class AccountController : Controller
{
    [Route("/Register")]
    public ActionResult register(User u)
    {
        // The incoming message will be a new user object to add to the database
        
        // TODO - Add the new user to the database
        
        return Ok("User is added")
    }

    [Route("/Login")]
    public ActionResult login(User u)
    {
        // As of right now, the incoming message will be a user object with their populated fields. This may change
        
        // TODO - Check the username and password against the database, and send appropriate response
        
        return Ok("Login is confirmed")
    }
}