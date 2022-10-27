package Simulation;

public class SimulationRequestManual {
    public String[][] board;
    public boolean isWhiteAI;
    public String clientId;

    public SimulationRequestManual() {

    }

    public SimulationRequestManual(String[][] board, boolean isWhiteAI, String clientId) {
        this.board = board;
        this.isWhiteAI = isWhiteAI;
        this.clientId = clientId;
    }
}
