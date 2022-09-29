using System.Net;
using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class AccountController : Controller
{
    public static string COOKIE_AUTH_TOKEN = "X_AVA_AuthToken";
    public static string COOKIE_REFRESH_TOKEN = "X_AVA_RefreshToken";
    public static CookieOptions COOKIE_OPTIONS = new CookieOptions
    {
        Secure = true,
        HttpOnly = true,
        Domain = "localhost",
        Expires = DateTime.UtcNow.AddYears(10),
        IsEssential = true
    };

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

        HttpContext.Response.Cookies.Append(COOKIE_AUTH_TOKEN, tokens.AuthToken, COOKIE_OPTIONS);
        HttpContext.Response.Cookies.Append(COOKIE_REFRESH_TOKEN, tokens.RefreshToken, COOKIE_OPTIONS);

        return Ok();
    }

    [HttpGet, Route("/WhoAmI"), Authorize]
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