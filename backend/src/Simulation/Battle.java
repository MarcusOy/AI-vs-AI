package Simulation;

import Strategy.Strategy;

import java.util.ArrayList;
import java.util.UUID;

// Stores all info related to a series of consecutive BattleGames
// between the same two AI.
public class Battle {
    private UUID id;
    private Strategy attackingStrategy;
    private Strategy defendingStrategy;
    private Status status;
    private int iterations;
    private int attackerWins;
    private int defenderWins;
    private int gamesCompleted;
    //stackTrace
    private ArrayList<BattleGame> battleGames;

    // Only internally used for fairness... Doesn't need to be stored or printed
    // Decided randomly in constructor
    private boolean willAttackerStartWhite;

    public Battle(int iterations, Strategy attackingStrategy, Strategy defendingStrategy) {
        id = UUID.randomUUID();
        this.attackingStrategy = attackingStrategy;
        this.defendingStrategy = defendingStrategy;
        this.iterations = iterations;
        battleGames = new ArrayList<>();
        willAttackerStartWhite = Math.random() < 0.5; // 50% odds the attacker will start white
        status = Status.READY;
    }

    // returns the newly created BattleGame
    public BattleGame addBattleGame() {
        // alternates attacker color every consecutive BattleGame
        Color attackerColor = getAttackerColor();
        battleGames.add(new BattleGame(battleGames.size(), attackerColor));

        return battleGames.get(battleGames.size() - 1);
    }

    // handles the ending of a BattleGame
    public void processGameWinner(BattleGame battleGame, Color winner) {
        if (battleGame.getAttackerColor().equals(winner))
            attackerWins++;
        else
            defenderWins++;

        gamesCompleted++;
    }

    // handles the completion of the Battle
    public void complete() {
        status = Status.COMPLETE;
    }

    public String printBattleGames() {
        StringBuilder s = new StringBuilder();

        for (BattleGame b : battleGames) {
            s.append("\n\t");
            s.append(b.toString());
        }

        return s.toString();
    }

    public UUID getId() {
        return id;
    }

    public int getIterations() { return iterations; }

    public int getAttackerWins() { return attackerWins; }

    public int getDefenderWins() { return defenderWins; }

    public Color getAttackerColor() {
        // used to make attacker start the color that willAttackerStartWhite dictates
        int startOffset = willAttackerStartWhite ? 0 : 1;

        return (gamesCompleted + startOffset) % 2 == 0 ? Color.WHITE : Color.BLACK;
    }

    @Override
    public String toString() {
        return "Battle{" +
                "id=" + id +
                ", status=" + status +
                ", attackingStrategy=" + attackingStrategy +
                ", defendingStrategy=" + defendingStrategy +
                ", iterations=" + iterations +
                ", attackerWins=" + attackerWins +
                ", defenderWins=" + defenderWins +
                ", gamesCompleted=" + defenderWins +
                ", battleGames=" + printBattleGames() /*battleGames*/ +
                '}';
    }
}
