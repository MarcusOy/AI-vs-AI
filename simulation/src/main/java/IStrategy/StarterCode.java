package IStrategy;

import API.API;
import Simulation.GameState;

import java.util.ArrayList;

public class StarterCode implements IStrategy {
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
     * @param gameState the current state of the game
     * @return a random move TODO change to return your choice of move
     */
    public String getMove(GameState gameState) {
        /* HINT: use the .isEmpty() and .size() methods of ArrayList
         * to see how many (if any) of a certain type of move exists
         */

        if (false /* insert your choice of condition */) {
            /* insert your choice of return move */
        }
        if (false /* insert your choice of return move */) {
            /* insert your choice of return move */
        }

        return getRandomMove(gameState);
    }

    /**
     * Returns a legal random move given the current game state (i.e. must escape check).
     *
     * If no legal move exists, returns "CHECKMATED" to indicate one has lost
     * @param gameState the current state of the game
     * @return a random move
     */
    public String getRandomMove(GameState gameState) {
        ArrayList<String> moves = getAllLegalMoves(gameState);

        if (moves.size() == 0) {				//if you have no legal moves, that means you are checkmated
            return "CHECKMATED";
        }
        return moves.get((int)(Math.random() * moves.size()));
    }

    /**
     *
     * Returns all legal moves
     *
     * @param gameState the current state of the game
     * @return an arraylist containing all legal moves
     */
    public ArrayList<String> getAllLegalMoves(GameState gameState) {
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
        return moves;
    }

    /**
     * Returns all legal moves that capture (not trade) a piece
     *
     * @param gameState the current state of the game
     * @return an arraylist containing all legal moves that capture (not trade) a piece
     */
    public ArrayList<String> getAllLegalCaptureMoves(GameState gameState) {
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

                //a valid move is guaranteed to land on either an empty space or one with an opposing piece
                if (api.getPieceMoveDistance(move, board) != 0 &&
                        api.getPieceMoveDistance(piece, board) > api.getPieceMoveDistance(move, board)) {
                    moves.add(piece + ", " + move);
                }
            }
        }
        return moves;
    }

    /**
     * Returns all legal moves that capture (not trade) a 1-piece
     *
     * @param gameState the current state of the game
     * @return an arraylist containing all legal moves that capture (not trade) a 1-piece
     */
    public ArrayList<String> getAllLegalCapture1PieceMoves(GameState gameState) {
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

                //a valid move is guaranteed to land on either an empty space or one with an opposing piece
                if (api.getPieceMoveDistance(move, board) == 1 &&
                        api.getPieceMoveDistance(piece, board) > api.getPieceMoveDistance(move, board)) {
                    moves.add(piece + ", " + move);
                }
            }
        }
        return moves;
    }
}
