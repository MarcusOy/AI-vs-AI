package Simulation;

import java.util.ArrayList;
import java.util.UUID;

public class Battle {
    private UUID id;
    //attackingStrategy
    //defendingStrategy
    private Status status;
    private int iterations;
    private int attackerWins;
    private int defenderWins;
    //stackTrace
    private ArrayList<BattleGame> battleGames;

    public Battle() {
        id = UUID.randomUUID();
        battleGames = new ArrayList<>();
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

        iterations++;
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

    public int getAttackerWins() { return attackerWins; }

    public int getDefenderWins() { return defenderWins; }

    public Color getAttackerColor() {
        return iterations % 2 == 0 ? Color.WHITE : Color.BLACK;
    }

    @Override
    public String toString() {
        return "Battle{" +
                "id=" + id +
                ", status=" + status +
                ", iterations=" + iterations +
                ", attackerWins=" + attackerWins +
                ", defenderWins=" + defenderWins +
                ", battleGames=" + printBattleGames() /*battleGames*/ +
                '}';
    }
}
