package Simulation;

public class SimulationResponseManual {
    public String[][] board;
    public int winner;

    public SimulationResponseManual() {

    }

    public SimulationResponseManual(String[][] board, int winner) {
        this.board = board;
        this.winner = winner;
    }
}
