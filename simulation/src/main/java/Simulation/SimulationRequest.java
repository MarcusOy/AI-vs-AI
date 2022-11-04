package Simulation;

public class SimulationRequest {
    public Battle pendingBattle;
    public String clientId;

    public SimulationRequest() {

    }

    public SimulationRequest(Battle pendingBattle, String clientId) {
        this.pendingBattle = pendingBattle;
        this.clientId = clientId;
    }
}