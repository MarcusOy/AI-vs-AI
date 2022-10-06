package Simulation;

public class SimulationRequest {
    public Battle pendingBattle;

    public SimulationRequest () {

    }

    public SimulationRequest (Battle pendingBattle) {
        this.pendingBattle = pendingBattle;
    }
}