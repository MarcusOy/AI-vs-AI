package Simulation;

public class SimulationManualRequest {
    public String[][] board;
    public boolean isWhiteAI;
    public String clientId;

    public SimulationManualRequest() {

    }

    public SimulationManualRequest(String[][] board, boolean isWhiteAI, String clientId) {
        this.board = board;
        this.isWhiteAI = isWhiteAI;
        this.clientId = clientId;
    }
}
