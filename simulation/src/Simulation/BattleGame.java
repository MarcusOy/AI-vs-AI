package Simulation;

import java.util.UUID;
import java.util.ArrayList;

// One specific game within the battle.
public class BattleGame {
    public int GameNumber;
    public boolean DidAttackerWin;

    public String BattleId;
    public Battle Battle;

    public ArrayList<Turn> Turns;

    private Color AttackerColor;

    public BattleGame(int gameNumber, String battleId, Color attackerColor) {
        this.GameNumber = gameNumber;
        this.BattleId = battleId;
        this.AttackerColor = attackerColor;
        Turns = new ArrayList<>();
    }

    public void addTurn(String battleId, Color currentPlayerColor, String moveString) {
        Turns.add(new Turn(battleId, GameNumber, Turns.size(), currentPlayerColor.equals(AttackerColor), moveString));
    }

    public void setWinner(Color winnerColor) {
        DidAttackerWin = winnerColor.equals(AttackerColor);
    }

    public int getGameNumber() { return GameNumber; }

    public Color getAttackerColor() { return AttackerColor; }

    public Color getDefenderColor() { return AttackerColor == Color.WHITE ? Color.BLACK : Color.WHITE; }

    public String getTurnsString() {
        StringBuilder s = new StringBuilder();
        for (Turn t : Turns) {
            s.append("\n\t\t");
            s.append(t.toString());
        }

        return s.toString();
    }

    @Override
    public String toString() {
        return "BattleGame{" +
                ", gameNumber=" + GameNumber +
                ", didAttackerWin=" + DidAttackerWin +
                ", attackerColor=" + AttackerColor +
                ", turns=" +  getTurnsString() /*turns*/ +
                '}';
    }
}
