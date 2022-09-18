package Strategy;

import API.API;
import Simulation.GameState;

import java.util.ArrayList;

public class RandomAI {
    public static String getMove(GameState gameState) {
        API api = new API();
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
        return moves.get((int)(Math.random() * moves.size()));
    }
}
