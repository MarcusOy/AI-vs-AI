package IStrategy;

import API.Java.API;
import Simulation.GameState;

import java.util.ArrayList;
/**
 * Capture moves will now be returned in an 9-array of ArrayLists with the following priorities
 * F2 captures 1
 * 3 captures 1
 * B2 captures 1
 * 4 captures 1
 * 3 captures B2
 * 4 captures B2
 * 3 captures F2
 * 4 captures F2
 * 4 captures 3
 *
 * The tiebreaker for all moves is whatever leaves the least non-formation pieces (1s and F2s) exposed to capture,
 * 1s being valued more (1s valued at 11, F2s valued at 10)
 */
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
                if (api.isPlayerInCheck(api.getMyColor(gameState), board) == api.TRUE) {
                    Object[] movesArray = getAllLegalCaptureMovesDifferentiated(gameState);
                    for (int i = 0; i < 9; i++) {
                        if (((ArrayList<String>)movesArray[i]).isEmpty())
                            continue;
                        return pickBestMoveFromList(gameState, ((ArrayList<String>)movesArray[i]));
                    }

                    ArrayList<String> moves = getAllLegalTrade1For1Moves(gameState);
                    if (!moves.isEmpty()) {
                        return pickBestMoveFromList(gameState, moves);
                    } else {    //no legal moves, means checkmated
                        return "CHECKMATED";
                    }
                } else {
                    Object[] movesArray = getAllLegalCaptureMovesDifferentiated(gameState);
                    for (int i = 0; i < 9; i++) {
                        if (((ArrayList<String>)movesArray[i]).isEmpty())
                            continue;
                        return pickBestMoveFromList(gameState, ((ArrayList<String>)movesArray[i]));
                    }
                    ArrayList<String> moves = getAllLegalTradeF2ForB2Moves(gameState);
                    if (!moves.isEmpty()) {
                        return pickBestMoveFromList(gameState, moves);
                    }
                    moves = getAllLegalTrade1For1Moves(gameState);
                    if (!moves.isEmpty()) {
                        return pickBestMoveFromList(gameState, moves);
                    }
                    moves = getAllLegalNonCaptureNonFormationMoves(gameState);
                    if (!moves.isEmpty()) {
                        return pickBestMoveFromList(gameState, moves);
                    }
                }
                //it technically should never get here
                throw new AssertionError("either we got checkmated or error");
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

    public Object[] getAllLegalCaptureMovesDifferentiated(GameState gameState) {
        String board[][] = api.getBoard(gameState);
        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);

        Object[] movesArray = new Object[9];
        for (int i = 0; i < 9; i++) {
            movesArray[i] = new ArrayList<String>();
        }

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
                    if (api.getPieceMoveDistance(move, board) == 1) {
                        if (api.getPieceMoveDistance(piece, board) == 2) {
                            if (api.cellToRow(piece) % 2 != api.getMyColor(gameState)) {        //back rank 2
                                ((ArrayList<String>)movesArray[2]).add(piece + ", " + move);
                            } else {            //front rank 2
                                ((ArrayList<String>)movesArray[0]).add(piece + ", " + move);
                            }
                        } else if (api.getPieceMoveDistance(piece, board) == 3) {
                            ((ArrayList<String>)movesArray[1]).add(piece + ", " + move);
                        } else {           //4
                            ((ArrayList<String>)movesArray[3]).add(piece + ", " + move);
                        }
                    } else if (api.getPieceMoveDistance(move, board) == 2) {
                        if (api.cellToRow(move) % 2 != api.getOpponentColor(api.getMyColor(gameState))) {        //back rank 2
                            if (api.getPieceMoveDistance(piece, board) == 3) {
                                ((ArrayList<String>)movesArray[4]).add(piece + ", " + move);
                            } else {        //4
                                ((ArrayList<String>)movesArray[5]).add(piece + ", " + move);
                            }
                        } else {            //front rank 2
                            if (api.getPieceMoveDistance(piece, board) == 3) {
                                ((ArrayList<String>)movesArray[6]).add(piece + ", " + move);
                            } else {        //4
                                ((ArrayList<String>)movesArray[7]).add(piece + ", " + move);
                            }
                        }
                    } else {        //4 captures 3
                        ((ArrayList<String>)movesArray[8]).add(piece + ", " + move);
                    }
                }
            }
        }

        return movesArray;
    }

    public ArrayList<String> getAllLegalNonCaptureNonFormationMoves(GameState gameState) {
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

                if (api.getPieceMoveDistance(move, board) == 0) {
                    if (api.getPieceMoveDistance(piece, board) == 1 || //front rank 2
                            (api.getPieceMoveDistance(piece, board) == 2) && api.cellToRow(piece) % 2 == api.getMyColor(gameState)) {
                        moves.add(piece + ", " + move);
                    }
                }
            }
        }
        return moves;
    }

    public ArrayList<String> getAllLegalTradeF2ForB2Moves(GameState gameState) {
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

                if (api.getPieceMoveDistance(piece, board) == 2 && api.getPieceMoveDistance(move, board) == 2
                        && api.cellToRow(piece) % 2 == api.getMyColor(gameState)) { //front rank 2
                    moves.add(piece + ", " + move);
                }
            }
        }
        return moves;
    }

    public ArrayList<String> getAllLegalTrade1For1Moves(GameState gameState) {
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

                if (api.getPieceMoveDistance(piece, board) == 1 && api.getPieceMoveDistance(move, board) == 1) {
                    moves.add(piece + ", " + move);
                }
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

    public String[][] tryThisMove(GameState gameState, String moveString) {
        //for this method specifically, since we're trying to move pieces around, we need to make a deep copy
        String[][] original =  api.getBoard(gameState);
        String[][] board = new String[api.BOARD_LENGTH][api.BOARD_LENGTH];
        for (int i = 0; i < api.BOARD_LENGTH; i++) {
            for (int j = 0; j < api.BOARD_LENGTH; j++) {
                board[i][j] = original[i][j];
            }
        }

        String[] moveCells = moveString.split(", ");

        String fromCell = moveCells[0];
        String toCell = moveCells[1];

        int fromMoveDistance = api.getPieceMoveDistance(fromCell, board);
        int toMoveDistance = api.getPieceMoveDistance(toCell, board);
        int fromCol = api.cellToCol(fromCell);
        int fromRow = api.cellToRow(fromCell);
        int toCol = api.cellToCol(toCell);
        int toRow = api.cellToRow(toCell);
        String fromPiece = board[fromCol][fromRow];
        String toPiece = board[toCol][toRow];

        // copies piece to new location
        if (fromMoveDistance > toMoveDistance) { // attacker wins
            board[toCol][toRow] = board[fromCol][fromRow];
        } else if (fromMoveDistance == toMoveDistance) { // both pieces die upon a tie
            board[toCol][toRow] = "";
        } else { // if (fromMoveDistance < toMoveDistance) // defender wins
            return null;    //return null to show that this is a suicide move which is very bad and shouldn't be considered
        }
        // removes piece from old location
        board[fromCol][fromRow] = "";
        return board;
    }

    public int nonFormationPiecesExposedToCapture(GameState gameState, String[][] newBoard) {
        if (newBoard == null) {     //the move tried was a suicide move, avoid at all costs
            return 1000000;
        }

        String[] myPieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), newBoard);
        ArrayList<String> my1PieceLocations = new ArrayList<String>();
        ArrayList<String> myF2PieceLocations = new ArrayList<String>();
        for (String piece : myPieceLocations) {
            if (piece.equals(""))
                break;
            if (api.getPieceMoveDistance(piece, newBoard) == 1) {
                my1PieceLocations.add(piece);
            } else if (api.getPieceMoveDistance(piece, newBoard) == 2 && api.cellToRow(piece) % 2 == api.getMyColor(gameState)) {   //front rank 2
                myF2PieceLocations.add(piece);
            }
        }

        int my1PiecesRemaining = my1PieceLocations.size();
        int myF2PiecesRemaining = myF2PieceLocations.size();
        //now we check how many capturing moves the OPPONENT has
        String[] opponentPieceLocations = api.getMyPieceLocations(api.getOpponentColor(api.getMyColor(gameState)), newBoard);
        for (String piece : opponentPieceLocations) {
            if (piece.equals(""))
                break;

            String[] validMoves = api.getValidMoves(piece, api.getOpponentColor(api.getMyColor(gameState)), newBoard);
            for (String move : validMoves) {
                if (move.equals(""))
                    break;

                //a valid move is guaranteed to land on either an empty space or one with an opposing piece
                if (api.getPieceMoveDistance(move, newBoard) != 0 &&
                        api.getPieceMoveDistance(piece, newBoard) > api.getPieceMoveDistance(move, newBoard)) {
                    //start crossing off locations of 1s and F2s exposed to capture
                    if (my1PieceLocations.contains(move)) {
                        my1PieceLocations.remove(move);
                    } else if (myF2PieceLocations.contains(move)) {
                        myF2PieceLocations.remove(move);
                    }
                }
            }
        }
        return (my1PiecesRemaining - my1PieceLocations.size()) * 11 + (myF2PiecesRemaining - myF2PieceLocations.size()) * 10;
    }

    public String pickBestMoveFromList(GameState gameState, ArrayList<String> moves) {
        //moves must not be empty
        if (moves.isEmpty()) {
            throw new AssertionError("i think we got checkmated");
        }

        int bestMoveIndex = 0;
        int bestMoveEvaluation = 1000001;
        for (int j = 0; j < moves.size(); j++) {
            int evaluation = nonFormationPiecesExposedToCapture(gameState, tryThisMove(gameState, moves.get(j)));
            if (evaluation < bestMoveEvaluation) {
                bestMoveIndex = j;
                bestMoveEvaluation = evaluation;
            } else if (evaluation == bestMoveEvaluation) {      //switch between equal moves with probability 0.1
                if (Math.random() < 0.1) {
                    bestMoveIndex = j;
                    bestMoveEvaluation = evaluation;
                }
            }
        }
        return moves.get(bestMoveIndex);
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
