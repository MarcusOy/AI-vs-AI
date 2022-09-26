package Strategy;

import Simulation.GameState;

public interface Strategy {
    public String getMove(GameState gameState);
}
