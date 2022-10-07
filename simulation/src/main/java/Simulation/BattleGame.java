package Simulation;

import java.util.ArrayList;

// One specific game within the battle.
public class BattleGame {
    public int gameNumber;
    public boolean didAttackerWin;

    public String battleId;

    public ArrayList<Turn> turns;

    private Color AttackerColor;

    public BattleGame(int gameNumber, String battleId, Color attackerColor) {
        this.gameNumber = gameNumber;
        this.battleId = battleId;
        this.AttackerColor = attackerColor;
        turns = new ArrayList<>();
    }

    public void addTurn(String battleId, Color currentPlayerColor, String moveString) {
        turns.add(new Turn(battleId, gameNumber, turns.size() + 1, currentPlayerColor.equals(AttackerColor), moveString));
    }

    public void setWinner(Color winnerColor) {
        didAttackerWin = winnerColor.equals(AttackerColor);
    }

    public int getGameNumber() { return gameNumber; }

    public Color getAttackerColor() { return AttackerColor; }

    public Color getDefenderColor() { return AttackerColor == Color.WHITE ? Color.BLACK : Color.WHITE; }

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
                ", gameNumber=" + gameNumber +
                ", didAttackerWin=" + didAttackerWin +
                ", attackerColor=" + AttackerColor +
                ", turns=" +  getTurnsString() /*turns*/ +
                '}';
    }
}
