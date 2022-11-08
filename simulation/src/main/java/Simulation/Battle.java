package Simulation;

import IStrategy.Strategy;

import java.util.ArrayList;
import java.util.UUID;

// Stores all info related to a series of consecutive BattleGames
// between the same two AI.
public class Battle {
    public String id;
    public String name;
    public int battleStatus;
    // Pending = 0
    // Success = 1
    // Fail = -1
    public int iterations;
    public int attackerWins;
    public int defenderWins;
    public String stackTrace;

    public String attackingStrategyId;
    public Strategy attackingStrategy;
    public String defendingStrategyId;
    public Strategy defendingStrategy;

    public boolean isTestSubmission;

    public ArrayList<BattleGame> battleGames;

    private int gamesCompleted;

    // Only internally used for fairness... Doesn't need to be stored or printed
    // Decided randomly in constructor
    private boolean willAttackerStartWhite;

    private String clientId;

    public Battle() {
        // id = UUID.randomUUID().toString();
        init();
    }

    public Battle(int iterations, String attackingStrategyId, String defendingStrategyId) {
        super();
        this.attackingStrategyId = attackingStrategyId;
        this.defendingStrategyId = defendingStrategyId;
        this.iterations = iterations;
    }

    public void init() {
        battleGames = new ArrayList<>();
        willAttackerStartWhite = Math.random() < 0.5; // 50% odds the attacker will start white
        battleStatus = 0;
    }

    // returns the newly created BattleGame
    public BattleGame addBattleGame() {
        // alternates attacker color every consecutive BattleGame
        Color attackerColor = getAttackerColor();
        battleGames.add(new BattleGame(battleGames.size() + 1, id, attackerColor));

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
        battleStatus = 1;
    }

    public String printBattleGames() {
        StringBuilder s = new StringBuilder();

        for (BattleGame b : battleGames) {
            s.append("\n\t");
            s.append(b.toString());
        }

        return s.toString();
    }

    public String getId() {
        return id;
    }

    public int getIterations() {
        return iterations;
    }

    public int getAttackerWins() {
        return attackerWins;
    }

    public int getDefenderWins() {
        return defenderWins;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientId() {
        return this.clientId;
    }

    public Color getAttackerColor() {
        // used to make attacker start the color that willAttackerStartWhite dictates
        int startOffset = willAttackerStartWhite ? 0 : 1;

        return (gamesCompleted + startOffset) % 2 == 0 ? Color.WHITE : Color.BLACK;
    }

    @Override
    public String toString() {
        return "Battle{" +
                "id=" + id +
                ", battleStatus=" + battleStatus +
                ", attackingStrategyId=" + attackingStrategyId +
                ", defendingStrategyId=" + defendingStrategyId +
                ", iterations=" + iterations +
                ", attackerWins=" + attackerWins +
                ", defenderWins=" + defenderWins +
                ", gamesCompleted=" + defenderWins +
                ", battleGames=" + printBattleGames() /* battleGames */ +
                '}';
    }
}
