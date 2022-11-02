package IStrategy;

import API.Java.API;
import Simulation.GameState;

import java.util.ArrayList;

public class MediumAI implements IStrategy {
    /**
     * API containing helper functions
     */
    private API api;

    private int turnNumber = 0; //useful for first few moves to set up formation

    public MediumAI() {
        api = new API();
    }

    /**
     * Please refer to the API for helper functions to code your starter AI
     *
     * @param gameState the current state of the game
     * @return a random move TODO change to return your choice of move
     */
    public String getMove(GameState gameState) {
        turnNumber++;

        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        switch (turnNumber) {
            case 1:
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    return "C9, E7"; //move the LEFT 2
                } else {                               //we are playing black
                    return "H0, F2"; //move the LEFT 2
                }
            case 2:
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    return "H9, F7"; //move the RIGHT 2
                } else {                               //we are playing black
                    return "C0, E2"; //move the RIGHT 2
                }
            case 3:
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    return "E9, E5"; //move the LEFT 4
                } else {                               //we are playing black
                    return "F0, F4"; //move the LEFT 4
                }
            case 4:
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    return "F9, F5"; //move the RIGHT 4
                } else {                               //we are playing black
                    return "E0, E4"; //move the RIGHT 4
                }
            case 5:     //here is where we take advantage of switch fallthrough (in 5 second cond isn't necessary, just for consistency)
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    if (getLeftThreeLocation(gameState) != null && !getLeftThreeLocation(gameState).equals("E9")) {
                        return "B9, E9"; //move the LEFT 3
                    }
                } else {                               //we are playing black
                    if (getLeftThreeLocation(gameState) != null && !getLeftThreeLocation(gameState).equals("F0")) {
                        return "I0, F0"; //move the LEFT 3
                    }
                }
            case 6:
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    if (getRightThreeLocation(gameState) != null && !getRightThreeLocation(gameState).equals("F9")) {
                        return "I9, F9"; //move the RIGHT 3
                    }
                } else {                               //we are playing black
                    if (getRightThreeLocation(gameState) != null && !getRightThreeLocation(gameState).equals("E0")) {
                        return "B0, E0"; //move the RIGHT 3
                    }
                }
            case 7:
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    if (api.getPieceColor("D9",  board) == api.getMyColor(gameState) &&
                            api.getPieceMoveDistance("D9", board) == 1) {
                        return "D9, C9"; //move the 1 blocking the OUTER 3
                    }
                } else {                               //we are playing black
                    if (api.getPieceColor("G0",  board) == api.getMyColor(gameState) &&
                            api.getPieceMoveDistance("G0", board) == 1) {
                        return "G0, H0"; //move the 1 blocking the OUTER 3
                    }
                }
            case 8:
                if (api.getMyColor(gameState) == 0) {    //we are playing white
                    if (getOuterThreeLocation(gameState) != null && !getOuterThreeLocation(gameState).equals("D9")) {
                        return "A9, D9"; //move the OUTER 3
                    }
                } else {                               //we are playing black
                    if (getOuterThreeLocation(gameState) != null && !getOuterThreeLocation(gameState).equals("G0")) {
                        return "J0, G0"; //move the OUTER 3
                    }
                }
            default:            //finished setting up formation phase
                return getRandomMove(gameState);
        }
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

    public boolean isInPartialFormation(GameState gameState) {
        if (api.getMyColor(gameState) == 0) {    //we are playing white
            return getLeftTwoLocation(gameState).equals("E7") &&
                    getRightTwoLocation(gameState).equals("F7") &&
                    getLeftFourLocation(gameState).equals("E5") &&
                    getRightFourLocation(gameState).equals("F5");
        } else {                            //we are playing black
            return getLeftTwoLocation(gameState).equals("F2") &&
                    getRightTwoLocation(gameState).equals("E2") &&
                    getLeftFourLocation(gameState).equals("F4") &&
                    getRightFourLocation(gameState).equals("E4");
        }
    }

    public boolean isInFullFormation(GameState gameState) {
        if (api.getMyColor(gameState) == 0) {    //we are playing white
            return isInPartialFormation(gameState) &&
                    getOuterThreeLocation(gameState).equals("D9") &&
                    getLeftThreeLocation(gameState).equals("E9") &&
                    getRightThreeLocation(gameState).equals("F9");
        } else {                            //we are playing black
            return isInPartialFormation(gameState) &&
                    getOuterThreeLocation(gameState).equals("G0") &&
                    getLeftThreeLocation(gameState).equals("F0") &&
                    getRightThreeLocation(gameState).equals("E0");
        }
    }

    public boolean isInPartialFormationOrCaptured(GameState gameState) {
        if (api.getMyColor(gameState) == 0) {    //we are playing white
            return (getLeftTwoLocation(gameState) == null || getLeftTwoLocation(gameState).equals("E7")) &&
                    (getRightTwoLocation(gameState) == null || getRightTwoLocation(gameState).equals("F7")) &&
                    getLeftFourLocation(gameState).equals("E5") &&
                    getRightFourLocation(gameState).equals("F5");
        } else {                            //we are playing black
            return (getLeftTwoLocation(gameState) == null || getLeftTwoLocation(gameState).equals("F2")) &&
                    (getRightTwoLocation(gameState) == null || getRightTwoLocation(gameState).equals("E2")) &&
                    getLeftFourLocation(gameState).equals("F4") &&
                    getRightFourLocation(gameState).equals("E4");
        }
    }

    public boolean isInFullFormationOrCaptured(GameState gameState) {
        if (api.getMyColor(gameState) == 0) {    //we are playing white
            return isInPartialFormationOrCaptured(gameState) &&
                    (getOuterThreeLocation(gameState) == null || getOuterThreeLocation(gameState).equals("D9")) &&
                    (getLeftThreeLocation(gameState) == null || getLeftThreeLocation(gameState).equals("E9")) &&
                    (getRightThreeLocation(gameState) == null || getRightThreeLocation(gameState).equals("F9"));
        } else {                            //we are playing black
            return isInPartialFormationOrCaptured(gameState) &&
                    (getOuterThreeLocation(gameState) == null || getOuterThreeLocation(gameState).equals("G0")) &&
                    (getLeftThreeLocation(gameState) == null || getLeftThreeLocation(gameState).equals("F0")) &&
                    (getRightThreeLocation(gameState) == null || getRightThreeLocation(gameState).equals("E0"));
        }
    }


    public String getLeftTwoLocation(GameState gameState) {
        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        for (String piece : pieceLocations) {
            if (piece.equals(""))
                break;

            if (api.getPieceMoveDistance(piece, board) == 2 &&
                    api.cellToRow(piece) % 2 != api.getMyColor(gameState) && api.cellToCol(piece) % 2 == api.getMyColor(gameState)) {
                return piece;
            }
        }
        //the left two was captured
        return null;
    }

    public String getRightTwoLocation(GameState gameState) {
        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        for (String piece : pieceLocations) {
            if (piece.equals(""))
                break;

            if (api.getPieceMoveDistance(piece, board) == 2 &&
                    api.cellToRow(piece) % 2 != api.getMyColor(gameState) && api.cellToCol(piece) % 2 != api.getMyColor(gameState)) {
                return piece;
            }
        }
        //the right two was captured
        return null;
    }

    public String getOuterThreeLocation(GameState gameState) {
        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        for (String piece : pieceLocations) {
            if (piece.equals(""))
                break;

            if (api.getPieceMoveDistance(piece, board) == 3 &&
                     api.cellToCol(piece) % 3 == 0) {
                return piece;
            }
        }
        //the outer three was captured
        return null;
    }

    public String getLeftThreeLocation(GameState gameState) {
        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        for (String piece : pieceLocations) {
            if (piece.equals(""))
                break;

            if (api.getPieceMoveDistance(piece, board) == 3 &&
                    api.cellToCol(piece) % 3 == api.getMyColor(gameState) + 1) {
                return piece;
            }
        }
        //the left three was captured
        return null;
    }

    public String getRightThreeLocation(GameState gameState) {
        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        for (String piece : pieceLocations) {
            if (piece.equals(""))
                break;

            if (api.getPieceMoveDistance(piece, board) == 3 &&
                    api.cellToCol(piece) % 3 == 2 - api.getMyColor(gameState)) {
                return piece;
            }
        }
        //the right three was captured
        return null;
    }

    public String getLeftFourLocation(GameState gameState) {
        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        for (String piece : pieceLocations) {
            if (piece.equals(""))
                break;

            if (api.getPieceMoveDistance(piece, board) == 4 &&
                    api.cellToCol(piece) % 4 == api.getMyColor(gameState)) {
                return piece;
            }
        }
        //not possible for left four to be captured
        throw new AssertionError("bug captured four");
    }

    public String getRightFourLocation(GameState gameState) {
        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        for (String piece : pieceLocations) {
            if (piece.equals(""))
                break;

            if (api.getPieceMoveDistance(piece, board) == 4 &&
                    api.cellToCol(piece) % 4 == api.getOpponentColor(api.getMyColor(gameState))) {
                return piece;
            }
        }
        //not possible for right four to be captured
        throw new AssertionError("bug captured four");
    }
}
