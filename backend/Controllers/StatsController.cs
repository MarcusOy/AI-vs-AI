using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class StatsController : Controller
{

    private readonly IBattlesService _battleService;

    public StatsController(IBattlesService battlesService)
    {
        _battleService = battlesService;
    }


    [HttpGet, Route("/getStats/{BattleId}/{StratId}")]
    public ActionResult getStats(String BattleId, String StratId)
    {
        // The incoming message will be the battle id to display the stats from. This may 
        Guid idBattle = new Guid(BattleId);
        Guid idStrat = new Guid(StratId);

        Battle b = _battleService.Get(idBattle);
        Boolean isAttacker = b.AttackingStrategy.Id == idStrat;
        int totalTurn = 0;
        int count = 0;
        List<int> movesToWin = new List<int>();

        foreach (BattleGame bg in b.BattleGames)
        {
            bool didAttackerWin = bg.DidAttackerWin;
            movesToWin.Add(0);

            if (didAttackerWin != isAttacker)
            {
                continue;
            }

            decimal turns = bg.Turns.Count;
            int battleTurn = 0;

            if (didAttackerWin)
            {
                battleTurn = (int)Math.Floor(turns / 2);
            }
            else
            {
                battleTurn = (int)Math.Ceiling(turns / 2);
            }

            totalTurn += battleTurn;
            movesToWin[movesToWin.Count - 1] = battleTurn;
            count++;
        }

        int avgTurns = (int)Math.Round((decimal)totalTurn / count);

        var ret = new { turns = totalTurn, averageTurns = avgTurns, movesToWin = movesToWin };

        return Ok(ret);
    }
}