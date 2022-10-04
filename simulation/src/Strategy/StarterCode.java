package Strategy;

import API.API;
import Simulation.GameState;
import Strategy.Strategy;

import java.util.ArrayList;

public class StarterCode implements Strategy {
    /**
     * API containing helper functions
     */
    private API api;

    public StarterCode() {
        api = new API();
    }



    /**
     * Please refer to the API for helper functions to code your starter AI
     *
     * @param gameState
     * @return a random move TODO change to return your choice of move
     */
    public String getMove(GameState gameState) {
        //TODO change to return your choice of move

        return getRandomMove(gameState);
    }

    /**
     * Returns a legal random move given the current game state (i.e. must escape check).
     *
     * If no legal move exists, returns "CHECKMATED" to indicate one has lost
     * @param gameState
     * @return a random move
     */
    public String getRandomMove(GameState gameState) {
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

    /**
     * Returns all legal moves
     */

    /**
     * Returns all moves which capture (not trade) a piece
     */

    /**
     * Returns all moves which capture (not trade) a 1-piece
     */


}
