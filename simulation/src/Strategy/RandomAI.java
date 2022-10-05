package Strategy;

import API.API;
import Simulation.GameState;
import Strategy.Strategy;

import java.util.ArrayList;

public class RandomAI implements Strategy {
    /**
     * API containing helper functions
     */
    private API api;

    public RandomAI() {
        api = new API();
    }

    public String getMove(GameState gameState) {
        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        ArrayList<String> moves = new ArrayList<String>();
        for (String piece : pieceLocations) {
            if (piece.equals(""))
                break;

            String[] validMoves = api.getValidMoves(piece, api.getMyColor(gameState), board);
            for (String move : validMoves) {
                if (move.equals(""))
                    break;

                moves.add(piece + ", " + move);
            }
        }

        if (moves.size() == 0) {				//if you have no legal moves, that means you are checkmated
            return "CHECKMATED";
        }
        return moves.get((int)(Math.random() * moves.size()));
    }
}
