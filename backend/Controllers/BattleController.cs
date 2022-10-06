// using AVA.API.Models;
// using AVA.API.Services;
// using Microsoft.AspNetCore.Mvc;

// namespace AVA.API.Controllers;

// public class BattleController : Controller
// {

//     [Route("/battlePerson")]
//     public ActionResult startBattle(Strategy s1, Strategy s2)
//     {
//         // As of right now, the incoming message will consist of two strategies to battle each other

//         // TODO - run the battle, and send the information back to the client

//         return Ok("Battle info sent here");
//     }

//     [Route("/battleNpc")]
//     public ActionResult startBattle(Strategy s1, Strategy s2) // Might get rid of this one
//     {
//         // As of right now, the incoming message will consist of two strategies, one the user's, one ours

//         // TODO - run the battle, and send the information back to the client
//     }
// }