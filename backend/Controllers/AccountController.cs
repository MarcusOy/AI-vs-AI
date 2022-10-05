﻿using System.Net;
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

    public AccountController(IIdentityService idService)
    {
        _idService = idService;
    }

    [HttpPost, Route("/Account/Login")]
    public async Task<ActionResult> Login([FromBody] LoginPair pair)
    {
        await Task.Delay(1000);
        var tokens = await _idService.Authenticate(pair.Username, pair.Password);

        HttpContext.Response.Cookies.Append(COOKIE_AUTH_TOKEN, tokens.AuthToken, COOKIE_OPTIONS);
        HttpContext.Response.Cookies.Append(COOKIE_REFRESH_TOKEN, tokens.RefreshToken, COOKIE_OPTIONS);

        return Ok("User is now logged in.");
    }

    [HttpPost, Route("/Account/Signup")]
    public async Task<ActionResult> Signup([FromBody] SignupForm body)
    {
        await Task.Delay(1000);
        await _idService.Register(body.FirstName, body.LastName, body.Email, body.Username, body.Password);
        return Ok("User is created.");
    }

    [HttpPost, Route("/Account/Logout"), Authorize]
    public async Task<ActionResult> Logout()
    {
        await Task.Delay(1000);
        HttpContext.Response.Cookies.Delete(COOKIE_AUTH_TOKEN);
        HttpContext.Response.Cookies.Delete(COOKIE_REFRESH_TOKEN);

        return Ok("User is logged out.");
    }

    [HttpGet, Route("/Account/WhoAmI"), Authorize]
    public User WhoAmI()
    {
        return _idService.CurrentUser;
    }

    [HttpPost, Route("/Account"), Authorize]
    public async Task<User> Update([FromBody] User u)
    {
        // TODO: redo this check when admin roles 
        //       are introduced
        if (u.Id != _idService.CurrentUser.Id)
            throw new InvalidOperationException("Cannot edit other user.");

        return await _idService.UpdateAsync(u);
    }

    [HttpDelete, Route("/Account"), Authorize]
    public async Task<ActionResult> Delete()
    {
        await _idService.DeleteAsync(_idService.CurrentUser.Id);
        return Ok("User is deleted.");
    }

    // [Route("/getAccount")]
    // public ActionResult displayAccount(User u)
    // {
    //     // The incoming message will be a user object to display information from

    //     // TODO - send the user information to the client

    //     return Ok("User info goes here");
    // }

    public class SignupForm
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class LoginPair
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}