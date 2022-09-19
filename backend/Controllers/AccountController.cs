using Microsoft.AspNetCore.Mvc;

namespace DefaultNamespace;

public class AccountController : Controller
{
    [Route("/register")]
    public ActionResult register(User u)
    {
        // The incoming message will be a new user object to add to the database
        
        // TODO - Add the new user to the database

        return Ok("User is added");
    }

    [Route("/login")]
    public ActionResult login(User u)
    {
        // As of right now, the incoming message will be a user object with their populated fields. This may change
        
        // TODO - Check the username and password against the database, and send appropriate response

        return Ok("Send user object back here");
    }

    [Route("/deleteAccount")]
    public ActionResult delete(User u)
    {
        // The incoming message will be a user object to delete.
        
        // TODO - remove the user specified from the database

        return Ok("User is deleted");
    }

    [Route("/editAccount")]
    public ActionResult editAccount(User u)
    {
        // The incoming message will be a user object to update
        
        // TODO - send the edited user to the database to be updated.

        return Ok("User is updated");
    }

    [Route("/getAccount")]
    public ActionResult displayAccount(User u)
    {
        // The incoming message will be a user object to display information from
        
        // TODO - send the user information to the client

        return Ok("User info goes here");
    }
}