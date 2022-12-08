package Simulation;

import java.util.UUID;

public class SimulationStepRequest {
    public String[][] sentBoard;
    public boolean isWhiteTurn;
    public String clientId;
    public UUID strategyId;
    public String strategySnapshot;

    public SimulationStepRequest() {

    }

    public SimulationStepRequest(String[][] sentBoard, boolean isWhiteTurn, String clientId, UUID strategyId, String strategySnapshot) {
        this.sentBoard = sentBoard;
        this.isWhiteTurn = isWhiteTurn;
        this.clientId = clientId;
        this.strategyId = strategyId;
        this.strategySnapshot = strategySnapshot;
    }
}
