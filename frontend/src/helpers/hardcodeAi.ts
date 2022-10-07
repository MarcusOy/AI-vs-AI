// eslint-disable-next-line no-useless-escape
export const developerAi = 'package Strategy;\n\nimport API.API;\nimport Simulation.GameState;\nimport Strategy.Strategy;\n\nimport java.util.ArrayList;\n\npublic class StarterCode implements Strategy {\n    /**\n     * API containing helper functions\n     */\n    private API api;\n\n    public StarterCode() {\n        api = new API();\n    }\n\n    /**\n     * Please refer to the API for helper functions to code your starter AI\n     *\n     * @param gameState the current state of the game\n     * @return a random move TODO change to return your choice of move\n     */\n    public String getMove(GameState gameState) {\n        /* HINT: use the .isEmpty() and .size() methods of ArrayList\n         * to see how many (if any) of a certain type of move exists\n         */\n\n        if (false /* insert your choice of condition */) {\n            /* insert your choice of return move */\n        }\n        if (false /* insert your choice of return move */) {\n            /* insert your choice of return move */\n        }\n\n        return getRandomMove(gameState);\n    }\n\n    /**\n     * Returns a legal random move given the current game state (i.e. must escape check).\n     *\n     * If no legal move exists, returns \"CHECKMATED\" to indicate one has lost\n     * @param gameState the current state of the game\n     * @return a random move\n     */\n    public String getRandomMove(GameState gameState) {\n        ArrayList<String> moves = getAllLegalMoves(gameState);\n\n        if (moves.size() == 0) {\t\t\t\t//if you have no legal moves, that means you are checkmated\n            return \"CHECKMATED\";\n        }\n        return moves.get((int)(Math.random() * moves.size()));\n    }\n\n    /**\n     *\n     * Returns all legal moves\n     *\n     * @param gameState the current state of the game\n     * @return an arraylist containing all legal moves\n     */\n    public ArrayList<String> getAllLegalMoves(GameState gameState) {\n        String board[][] = api.getBoard(gameState);\n        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);\n\n        ArrayList<String> moves = new ArrayList<String>();\n        for (String piece : pieceLocations) {\n            if (piece.equals(\"\"))\n                break;\n\n            String[] validMoves = api.getValidMoves(piece, api.getMyColor(gameState), board);\n            for (String move : validMoves) {\n                if (move.equals(\"\"))\n                    break;\n\n                moves.add(piece + \", \" + move);\n            }\n        }\n        return moves;\n    }\n\n    /**\n     * Returns all legal moves that capture (not trade) a piece\n     *\n     * @param gameState the current state of the game\n     * @return an arraylist containing all legal moves that capture (not trade) a piece\n     */\n    public ArrayList<String> getAllLegalCaptureMoves(GameState gameState) {\n        String board[][] = api.getBoard(gameState);\n        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);\n\n        ArrayList<String> moves = new ArrayList<String>();\n        for (String piece : pieceLocations) {\n            if (piece.equals(\"\"))\n                break;\n\n            String[] validMoves = api.getValidMoves(piece, api.getMyColor(gameState), board);\n            for (String move : validMoves) {\n                if (move.equals(\"\"))\n                    break;\n\n                //a valid move is guaranteed to land on either an empty space or one with an opposing piece\n                if (api.getPieceMoveDistance(move, board) != 0 &&\n                        api.getPieceMoveDistance(piece, board) > api.getPieceMoveDistance(move, board)) {\n                    moves.add(piece + \", \" + move);\n                }\n            }\n        }\n        return moves;\n    }\n\n    /**\n     * Returns all legal moves that capture (not trade) a 1-piece\n     *\n     * @param gameState the current state of the game\n     * @return an arraylist containing all legal moves that capture (not trade) a 1-piece\n     */\n    public ArrayList<String> getAllLegalCapture1PieceMoves(GameState gameState) {\n        String board[][] = api.getBoard(gameState);\n        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);\n\n        ArrayList<String> moves = new ArrayList<String>();\n        for (String piece : pieceLocations) {\n            if (piece.equals(\"\"))\n                break;\n\n            String[] validMoves = api.getValidMoves(piece, api.getMyColor(gameState), board);\n            for (String move : validMoves) {\n                if (move.equals(\"\"))\n                    break;\n\n                //a valid move is guaranteed to land on either an empty space or one with an opposing piece\n                if (api.getPieceMoveDistance(move, board) == 1 &&\n                        api.getPieceMoveDistance(piece, board) > api.getPieceMoveDistance(move, board)) {\n                    moves.add(piece + \", \" + move);\n                }\n            }\n        }\n        return moves;\n    }\n}'
export const easyAi = `package Strategy;

import API.API;
import Simulation.GameState;
import Strategy.Strategy;

import java.util.ArrayList;

public class EasyAI implements Strategy {
    private int turnNumber = 0;
    /**
     * API containing helper functions
     */
    private API api;

    public EasyAI() {
        api = new API();
    }

    public String getMove(GameState gameState) {
        turnNumber++;

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
                        return moves[(int) (Math.random() * moves.length)];
                    }
                } else {                            //we are playing black
                    if (board[1][6].equals("w3") || board[4][6].equals("w3")) {
                        return "F0, F4";            //move the RIGHT 4 if opponent moved the LEFT 3
                    } else if (board[5][6].equals("w3") || board[9][6].equals("w3")) {
                        return "E0, E4";            //move the LEFT 4 if opponent moved the RIGHT 3
                    } else {
                        String[] moves = {"E0, E4", "F0, F4"};      //pick randomly
                        return moves[(int) (Math.random() * moves.length)];
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
                        return moves[(int) (Math.random() * moves.length)];
                    }
                } else {                            //we are playing black
                    if (board[5][0].equals("b2")) {      //we moved the RIGHT 2 for our second move
                        return "E0, E4";            //move the LEFT 4
                    } else if (board[4][0].equals("b2")) { //we moved the LEFT 2 for our second move
                        return "F0, F4";            //move the RIGHT 4
                    } else {
                        String[] moves = {"H0, F0", "C0, E0"};      //let's just move a random 2 and hope for the best =)
                        return moves[(int) (Math.random() * moves.length)];
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
                if (api.isPlayerInCheck(api.getMyColor(gameState), board) == api.TRUE) {        // Capture the opponent’s 1
                    ArrayList<String> moves = new ArrayList<String>();
                    for (String location : pieceLocations) {
                        if (location.equals(""))
                            break;
                        String[] validMoves = api.getValidMoves(location, api.getMyColor(gameState), board);
                        for (String move : validMoves) {
                            if (move.equals(""))
                                break;
                            moves.add(location + ", " + move);
                        }
                    }
                    if (moves.size() == 0) {                //if you have no legal moves, that means you are checkmated
                        return "CHECKMATED";
                    }
                    return moves.get((int) (Math.random() * moves.size()));
                } else {
                    ArrayList<String> moves = new ArrayList<String>();
                    for (String location : pieceLocations) {
                        if (location.equals(""))
                            break;
                        /*if (piece.equals("w4") || piece.equals("b4"))
                            continue;
                        if (piece.equals("w2") || piece.equals("b2"))
                            continue;*/
                        int piece = api.getPieceMoveDistance(location, board);
                        if (piece == 4) {                   //do not move pieces that are part of the formation
                            continue;
                        }
                        if (piece == 2 && api.cellToRow(location) % 2 != api.getMyColor(gameState)) {   //neat way to check which parity of 2s
                            continue;
                        }

                        String[] validMoves = api.getValidMoves(location, api.getMyColor(gameState), board);
                        for (String move : validMoves) {
                            if (move.equals(""))
                                break;

                            moves.add(location + ", " + move);
                        }
                    }
                    if (moves.size() == 0) {                //if you have no legal moves, that means you are checkmated
                        return "CHECKMATED";
                    }
                    return moves.get((int) (Math.random() * moves.size()));
                }
        }
    }
}`