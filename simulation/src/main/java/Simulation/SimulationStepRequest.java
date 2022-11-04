package Simulation;

import java.util.UUID;

public class SimulationStepRequest {
    public String[][] sentBoard;
    public boolean isWhiteAI;
    public String clientId;
    public UUID chosenStockId;

    public SimulationStepRequest() {

    }

    public SimulationStepRequest(String[][] sentBoard, boolean isWhiteAI, String clientId, UUID chosenStockId) {
        this.sentBoard = sentBoard;
        this.isWhiteAI = isWhiteAI;
        this.clientId = clientId;
        this.chosenStockId = chosenStockId;
    }
}
