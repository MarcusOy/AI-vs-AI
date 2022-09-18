package Simulation;

import java.util.UUID;
import java.util.ArrayList;

public class BattleGame {
    private UUID id;
    private int gameNumber;
    private boolean didAttackerWin;
    private Color attackerColor;
    private ArrayList<Turn> turns;

    public BattleGame(int gameNumber, Color attackerColor) {
        id = UUID.randomUUID();
        this.gameNumber = gameNumber;
        this.attackerColor = attackerColor;
        turns = new ArrayList<>();
    }

    public void addTurn(UUID battleId, Color currentPlayerColor, String moveString) {
        turns.add(new Turn(battleId, gameNumber, turns.size(), currentPlayerColor.equals(attackerColor), moveString));
    }

    public void setWinner(Color winnerColor) {
        didAttackerWin = winnerColor.equals(attackerColor);
    }

    public int getGameNumber() { return gameNumber; }

    public Color getAttackerColor() { return attackerColor; }

    public Color getDefenderColor() { return attackerColor == Color.WHITE ? Color.BLACK : Color.WHITE; }

    public String getTurnsString() {
        StringBuilder s = new StringBuilder();
        for (Turn t : turns) {
            s.append("\n\t\t");
            s.append(t.toString());
        }

        return s.toString();
    }

    @Override
    public String toString() {
        return "BattleGame{" +
                "id=" + id +
                ", gameNumber=" + gameNumber +
                ", didAttackerWin=" + didAttackerWin +
                ", attackerColor=" + attackerColor +
                ", turns=" +  getTurnsString() /*turns*/ +
                '}';
    }
}
