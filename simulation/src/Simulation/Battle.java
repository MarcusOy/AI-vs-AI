package Simulation;

import IStrategy.Strategy;

import java.util.ArrayList;
import java.util.UUID;

// Stores all info related to a series of consecutive BattleGames
// between the same two AI.
public class Battle {
    public String Id;
    public String Name;
    public BattleStatus BattleStatus;
    public int Iterations;
    public int AttackerWins;
    public int DefenderWins;
    public String StackTrace;

    public String AttackingStrategyId;
    public Strategy AttackingStrategy;
    public String DefendingStrategyId;
    public Strategy DefendingStrategy;

    public ArrayList<BattleGame> BattleGames;

    private int gamesCompleted;

    // Only internally used for fairness... Doesn't need to be stored or printed
    // Decided randomly in constructor
    private boolean willAttackerStartWhite;

    public Battle(int iterations, String attackingStrategyId, String defendingStrategyId) {
        Id = UUID.randomUUID().toString();
        this.AttackingStrategyId = attackingStrategyId;
        this.DefendingStrategyId = defendingStrategyId;
        this.Iterations = iterations;
        BattleGames = new ArrayList<>();
        willAttackerStartWhite = Math.random() < 0.5; // 50% odds the attacker will start white
        BattleStatus = Simulation.BattleStatus.READY;
    }

    // returns the newly created BattleGame
    public BattleGame addBattleGame() {
        // alternates attacker color every consecutive BattleGame
        Color attackerColor = getAttackerColor();
        BattleGames.add(new BattleGame(BattleGames.size(), Id, attackerColor));

        return BattleGames.get(BattleGames.size() - 1);
    }

    // handles the ending of a BattleGame
    public void processGameWinner(BattleGame battleGame, Color winner) {
        if (battleGame.getAttackerColor().equals(winner))
            AttackerWins++;
        else
            DefenderWins++;

        gamesCompleted++;
    }

    // handles the completion of the Battle
    public void complete() {
        BattleStatus = Simulation.BattleStatus.COMPLETE;
    }

    public String printBattleGames() {
        StringBuilder s = new StringBuilder();

        for (BattleGame b : BattleGames) {
            s.append("\n\t");
            s.append(b.toString());
        }

        return s.toString();
    }

    public String getId() {
        return Id;
    }

    public int getIterations() { return Iterations; }

    public int getAttackerWins() { return AttackerWins; }

    public int getDefenderWins() { return DefenderWins; }

    public Color getAttackerColor() {
        // used to make attacker start the color that willAttackerStartWhite dictates
        int startOffset = willAttackerStartWhite ? 0 : 1;

        return (gamesCompleted + startOffset) % 2 == 0 ? Color.WHITE : Color.BLACK;
    }

    @Override
    public String toString() {
        return "Battle{" +
                "id=" + Id +
                ", battleStatus=" + BattleStatus +
                ", attackingStrategyId=" + AttackingStrategyId +
                ", defendingStrategyId=" + DefendingStrategyId +
                ", iterations=" + Iterations +
                ", attackerWins=" + AttackerWins +
                ", defenderWins=" + DefenderWins +
                ", gamesCompleted=" + DefenderWins +
                ", battleGames=" + printBattleGames() /*battleGames*/ +
                '}';
    }
}
