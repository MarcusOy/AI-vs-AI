using System.Net;
using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace DefaultNamespace;

public class AccountController : Controller
{
    // [Route("/register")]
    // public ActionResult register(User u)
    // {
    //     // The incoming message will be a new user object to add to the database

    //     // TODO - Add the new user to the database

    //     return Ok("User is added");
    // }

    private readonly IIdentityService _idService;
    private readonly AVADbContext _dbContext;

    public AccountController(IIdentityService idService, AVADbContext dbContext)
    {
        _idService = idService;
        _dbContext = dbContext;
    }

    [HttpPost, Route("/Login")]
    public async Task<ActionResult> Login([FromBody] LoginPair pair)
    {
        var tokens = await _idService.Authenticate(pair.Username, pair.Password);

        var cookieOptions = new CookieOptions
        {
            Secure = true,
            HttpOnly = true,
            Domain = "localhost",
            Expires = DateTime.UtcNow.AddYears(10),
            IsEssential = true
        };

        HttpContext.Response.Cookies.Append("X_AVA_AuthToken", tokens.AuthToken, cookieOptions);
        HttpContext.Response.Cookies.Append("X_AVA_RefreshToken", tokens.RefreshToken, cookieOptions);

        return Ok();
    }

    [HttpGet, Route("/WhoAmI")]
    public User WhoAmI()
    {
        return _dbContext.Users
            .Where(u => u.Active)
            .FirstOrDefault(u => u.Username == _idService.CurrentUser.Username);
    }

    // [Route("/deleteAccount")]
    // public ActionResult delete(User u)
    // {
    //     // The incoming message will be a user object to delete.

    //     // TODO - remove the user specified from the database

    //     return Ok("User is deleted");
    // }

    // [Route("/editAccount")]
    // public ActionResult editAccount(User u)
    // {
    //     // The incoming message will be a user object to update

    //     // TODO - send the edited user to the database to be updated.

    //     return Ok("User is updated");
    // }

    // [Route("/getAccount")]
    // public ActionResult displayAccount(User u)
    // {
    //     // The incoming message will be a user object to display information from

    //     // TODO - send the user information to the client

    //     return Ok("User info goes here");
    // }

    public class LoginPair
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}