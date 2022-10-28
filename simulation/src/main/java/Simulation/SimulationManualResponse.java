package Simulation;

public class SimulationManualResponse {
    public String[][] board;
    public String moveString;
    public boolean isGameOver;
    public boolean didAttackerWin;

    public SimulationManualResponse() {

    }

    public SimulationManualResponse(String[][] board, String moveString, boolean isGameOver, boolean didAttackerWin) {
        this.board = board;
        this.moveString = moveString;
        this.isGameOver = isGameOver;
        this.didAttackerWin = didAttackerWin;
    }
}
