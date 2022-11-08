package Simulation;

public class SimulationStepResponse {
    public String[][] resultingBoard;
    public String moveString;
    public boolean isGameOver; // determines if one of the players won, and which
    public boolean didAttackerWin; // didplayerwin?
    public String clientId;

    public SimulationStepResponse() {

    }

    public SimulationStepResponse(String[][] resultingBoard, String moveString, boolean isGameOver, boolean didAttackerWin, String clientId) {
        this.resultingBoard = resultingBoard;
        this.moveString = moveString;
        this.isGameOver = isGameOver;
        this.didAttackerWin = didAttackerWin;
        this.clientId = clientId;
    }
}
