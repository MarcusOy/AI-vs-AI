package Simulation;

public class SimulationResponse {
    public Battle resultingBattle;
    public String clientId;

    public SimulationResponse() {

    }

    public SimulationResponse(Battle resultingBattle, String clientId) {
        this.resultingBattle = resultingBattle;
        this.clientId = clientId;
    }
}