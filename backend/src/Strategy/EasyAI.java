package Strategy;

import API.API;
import Simulation.GameState;
import Strategy.Strategy;

import java.util.ArrayList;

public class EasyAI implements Strategy {
    private int turnNumber = 0;

    public String getMove(GameState gameState) {
        turnNumber++;

        API api = new API();
        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        switch (turnNumber) {
            case 1:
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    if (board[1][3].equals("b3") || board[4][3].equals("b3")) {
                        return "F9, F5";            //move the RIGHT 4 if opponent moved the LEFT 3
                    } else if (board[5][3].equals("b3") || board[9][3].equals("b3")) {
                        return "E9, E5";            //move the LEFT 4 if opponent moved the RIGHT 3
                    } else {
                        String[] moves = {"E9, E5", "F9, F5"};      //pick randomly
                        return moves[(int)(Math.random() * moves.length)];
                    }
                } else {                            //we are playing black
                    if (board[1][6].equals("w3") || board[4][6].equals("w3")) {
                        return "F0, F4";            //move the RIGHT 4 if opponent moved the LEFT 3
                    } else if (board[5][6].equals("w3") || board[9][6].equals("w3")) {
                        return "E0, E4";            //move the LEFT 4 if opponent moved the RIGHT 3
                    } else {
                        String[] moves = {"E0, E4", "F0, F4"};      //pick randomly
                        return moves[(int)(Math.random() * moves.length)];
                    }
                }
            case 2:
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    if (board[5][5].equals("w4")) {      //we moved the RIGHT 4 for our first move
                        if (board[5][3].equals("b3") || board[9][3].equals("b3")) {
                            return "E9, E5";            //move the LEFT 4 if opponent moved the RIGHT 3
                        } else {                    //otherwise move the RIGHT 2
                            return "H9, F9";
                        }
                    } else if (board[4][5].equals("w4")) {                     //we moved the LEFT 4 for our first move
                        if (board[1][3].equals("b3") || board[4][3].equals("b3")) {
                            return "F9, F5";            //move the RIGHT 4 if opponent moved the LEFT 3
                        } else {                    //otherwise move the LEFT 2
                            return "C9, E9";
                        }
                    }
                } else {                            //we are playing black
                    if (board[5][4].equals("b4")) {      //we moved the RIGHT 4 for our first move
                        if (board[5][6].equals("w3") || board[9][6].equals("w3")) {
                            return "E0, E4";            //move the LEFT 4 if opponent moved the RIGHT 3
                        } else {                    //otherwise move the RIGHT 2
                            return "H0, F0";
                        }
                    } else if (board[4][4].equals("b4")) {                     //we moved the LEFT 4 for our first move
                        if (board[1][6].equals("w3") || board[4][6].equals("w3")) {
                            return "F0, F4";            //move the RIGHT 4 if opponent moved the LEFT 3
                        } else {                    //otherwise move the LEFT 2
                            return "C0, E0";
                        }
                    }
                }
            case 3:
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    if (board[5][9].equals("w2")) {      //we moved the RIGHT 2 for our second move
                        return "E9, E5";            //move the LEFT 4
                    } else if (board[4][9].equals("w2")) { //we moved the LEFT 2 for our second move
                        return "F9, F5";            //move the RIGHT 4
                    } else {
                        String[] moves = {"H9, F9", "C9, E9"};      //let's just move a random 2 and hope for the best =)
                        return moves[(int)(Math.random() * moves.length)];
                    }
                } else {                            //we are playing black
                    if (board[5][0].equals("b2")) {      //we moved the RIGHT 2 for our second move
                        return "E0, E4";            //move the LEFT 4
                    } else if (board[4][0].equals("b2")) { //we moved the LEFT 2 for our second move
                        return "F0, F4";            //move the RIGHT 4
                    } else {
                        String[] moves = {"H0, F0", "C0, E0"};      //let's just move a random 2 and hope for the best =)
                        return moves[(int)(Math.random() * moves.length)];
                    }
                }
            case 4:
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    if (board[5][9].equals("w2")) {      //we moved the RIGHT 2 already
                        return "C9, E9";            //move the LEFT 2
                    } else {
                        return "H9, F9";            //move the RIGHT 2
                    }
                } else {
                    if (board[5][0].equals("b2")) {      //we moved the RIGHT 2 already
                        return "C0, E0";            //move the LEFT 2
                    } else {
                        return "H0, F0";            //move the RIGHT 2
                    }
                }
            default:
                /*if (api.isPlayerInCheck(, board)) {        // Capture the opponent’s 1
                    int rowToCheck = getMyColor(gameState) == WHITE ? 9 : 0;            //sorry William i basically copied your code
                    int i;
                    for (i = 0; i < BOARD_LENGTH; i++) {
                        if ((getPieceColor(i, rowToCheck, board) == getOpponentColor(color))
                                && (getPieceMoveDistance(i, rowToCheck, board) == 1)) {
                            break;
                        }
                    }
                    if (getMyColor(gameState)) {
                        switch (i) {
                            case 0:

                            case 1:

                        }
                    } else {

                    }
                } else*/ //if (isFormationReady(gameState)) {
                    ArrayList<String> moves = new ArrayList<String>();
                    for (String piece : pieceLocations) {
                        if (piece.equals(""))
                            break;
                        if (piece.equals("w4") || piece.equals("b4"))
                            continue;
                        if (piece.equals("w2") || piece.equals("b2"))           //we can only move 3s and 1s
                            continue;

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
                //}
        }



	/*else
		first move 4s into center, then move 2s into middle of back rank
*/

        /*ArrayList<String> moves = new ArrayList<String>();
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
        return moves.get((int)(Math.random() * moves.size()));*/
    }

    public boolean isFormationReady(GameState gameState) {
        API api = new API();
        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        if (api.getMyColor(gameState) == 0) {	//we are playing white
            return (board[5][4].equals("w4") && board[5][5].equals("w4") && board[9][4].equals("w2") && board[9][5].equals("w2"));
        } else {
            return (board[4][4].equals("b4") && board[4][5].equals("b4") && board[0][4].equals("b2") && board[0][5].equals("b2"));
        }
    }
}





