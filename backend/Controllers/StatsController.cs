using System.Net;
using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class StatsController : Controller
{

    private readonly IBattlesService _battleService;

    private readonly IStrategiesService _strategyService;

    public StatsController(IBattlesService battlesService, IStrategiesService strategyService)
    {
        _battleService = battlesService;
        _strategyService = strategyService;
    }

    [HttpGet, Route("/GetStats/{BattleId}")]
    public async Task<ActionResult> GetBattleStats(String BattleId)
    {
        Guid IdBattle = new Guid(BattleId);

        Battle b = await _battleService.GetAsync(IdBattle);
        List<BattleGame> bg = b.BattleGames;

        int size = bg.Count;
        String[,] outcome = new String[size, 3];
        int idx = 0;

        foreach (BattleGame g in bg)
        {
            outcome[idx, 0] = "Game Number: " + g.GameNumber;
            if (g.DidAttackerWin)
            {
                outcome[idx, 1] = "Attacker Won";
            }
            else
            {
                outcome[idx, 1] = "Defender Won";
            }

            outcome[idx, 2] = "Turns: " + g.Turns.Count;

            idx++;
        }

        return Ok(outcome);
    }

    [HttpGet, Route("/GetStats/StratId/{StratId}"), Authorize]
    public ActionResult GetStratStats(String StratId)
    {
        Console.WriteLine("This is the strat id: " + StratId);
        Guid idStrat = new Guid(StratId);

        try
        {
            Strategy strat = _strategyService.Get(idStrat);

            List<Battle> attacker = strat.AttackerBattles;
            List<Battle> defender = strat.DefenderBattles;

            int NumWins = 0;
            int NumLoss = 0;

            foreach (Battle b in attacker)
            {
                NumWins += b.AttackerWins;
                NumLoss += b.DefenderWins;
            }

            foreach (Battle b in defender)
            {
                NumWins += b.DefenderWins;
                NumLoss += b.AttackerWins;
            }

            double WinLoss = 0;

            if (NumLoss == 0)
            {
                WinLoss = NumWins;
            }
            else
            {
                WinLoss = (double)NumWins / NumLoss;
            }
            var results = new
            {
                win = NumWins,
                loss = NumLoss
            };
            return Ok(results);
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return Ok(e.Message);
        }
    }

    [HttpGet, Route("/GetStats/BattleAndStrat/{BattleId}/{StratId}")]
    public ActionResult GetBattleStratStats(String BattleId, String StratId)
    {
        // The incoming message will be the battle id to display the stats from. This may 
        Guid idBattle = new Guid(BattleId);
        Guid idStrat = new Guid(StratId);

        Battle b = await _battleService.GetAsync(idBattle);
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