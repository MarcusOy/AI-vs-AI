package Simulation;

public class SimulationStepRequest {
    public String[][] sentBoard;
    public boolean isWhiteAI;
    public String clientId;

    public SimulationStepRequest() {

    }

    public SimulationStepRequest(String[][] sentBoard, boolean isWhiteAI, String clientId) {
        this.sentBoard = sentBoard;
        this.isWhiteAI = isWhiteAI;
        this.clientId = clientId;
    }
}
