package IStrategy;

import API.Java.API;
import Simulation.GameState;

import java.util.ArrayList;

public class HardAI implements IStrategy {
    /**
     * API containing helper functions
     */
    private API api;

    public HardAI() {
        api = new API();
    }

    //mostly just guessing at these values/weights

    private int[] pieceValueOfWhite1s = {-1000000, 0, 200, 341, 446, 550, 653, 755, 856, 956};
    private int[] pieceValueOfWhiteLF2s = {0, 90, 170};
    private int[] pieceValueOfWhiteRF2s = {0, 90, 170};
    private int[] pieceValueOfWhiteB2s = {0, 95, 200};      //B2 pair is very important
    private int[] pieceValueOfWhite3s = {0, 85, 170, 255};
    private int allFourWhite2sBonus = 10;

    private int[] pieceValueOfBlack1s = {1000000, 0, -200, -341, -446, -550, -653, -755, -856, -956};
    private int[] pieceValueOfBlackLF2s = {0, -90, -170};
    private int[] pieceValueOfBlackRF2s = {0, -90, -170};
    private int[] pieceValueOfBlackB2s = {0, -95, -200};    //B2 pair is very important
    private int[] pieceValueOfBlack3s = {0, -85, -170, -255};
    private int allFourBlack2sBonus = -10;
    
    private int[] attackValueOnBlack1s = {500000, 100, 70, 52, 52, 51, 51, 50, 50};
    private int[] attackValueOnBlackLF2s = {45, 40};
    private int[] attackValueOnBlackRF2s = {45, 40};
    private int[] attackValueOnBlackB2s = {47, 53}; //B2 pair is very important
    private int[] attackValueOnBlack3s = {42, 42, 42};
    private int attackOnBlack2sBonus = 5;

    private int[] attackValueOnWhite1s = {-500000, -100, -70, -52, -52, -51, -51, -50, -50};
    private int[] attackValueOnWhiteLF2s = {-45, -40};
    private int[] attackValueOnWhiteRF2s = {-45, -40};
    private int[] attackValueOnWhiteB2s = {-47, -53}; //B2 pair is very important
    private int[] attackValueOnWhite3s = {-42, -42, -42};
    private int attackOnWhite2sBonus = -5;

    private int[][] positionalValueOfWhite1s = {
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    };

    private int[][] positionalValueOfWhite2s = {
            {-4, 0, 3, -2, -2, 2, -2, 3, -3, -1},
            {-4, 0, 3, -2, -2, 2, -2, 3, -3, -1},
            {-1, 1, 4, -1, 4, 3, -1, 4, 2, 0},
            {-1, 1, 4, -1, 4, 3, -1, 4, 2, 0},
            {-2, 2, 5, 0, 0, 4, 0, 5, -1, 1},
            {-2, 2, 5, 0, 0, 4, 0, 5, -1, 1},
            {-1, 1, 4, -1, 4, 3, -1, 4, 2, 0},
            {-1, 1, 4, -1, 4, 3, -1, 4, 2, 0},
            {-4, 0, 3, -2, -2, 2, -2, 3, -3, -1},
            {-4, 0, 3, -2, -2, 2, -2, 3, -3, -1},
    };

    private int[][] positionalValueOfWhite3s = {
            {-2, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0},
            {-2, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0},
            {0, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0},
            {0, -1000000, -1000000, 3, -1000000, -1000000, 3, -1000000, -1000000, 2},
            {-2, -1000000, -1000000, 3, -1000000, -1000000, 3, -1000000, -1000000, 2},
            {-2, -1000000, -1000000, 3, -1000000, -1000000, 3, -1000000, -1000000, 2},
            {0, -1000000, -1000000, 3, -1000000, -1000000, 3, -1000000, -1000000, 2},
            {0, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0},
            {-2, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0},
            {-2, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0},
    };

    private int[][] positionalValueOfWhite4s = {
            {-1000000, 0, -1000000, -1000000, -1000000, 2, -1000000, -1000000, -1000000, 0},
            {-1000000, 0, -1000000, -1000000, -1000000, 2, -1000000, -1000000, -1000000, 0},
            {-1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000},
            {-1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000},
            {-1000000, 2, -1000000, -1000000, -1000000, 5, -1000000, -1000000, -1000000, 2},
            {-1000000, 2, -1000000, -1000000, -1000000, 5, -1000000, -1000000, -1000000, 2},
            {-1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000},
            {-1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000},
            {-1000000, 0, -1000000, -1000000, -1000000, 2, -1000000, -1000000, -1000000, 0},
            {-1000000, 0, -1000000, -1000000, -1000000, 2, -1000000, -1000000, -1000000, 0},
    };

    private int[][] positionalValueOfBlack1s = {
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    };

    private int[][] positionalValueOfBlack2s = {
            {1, 3, -3, 2, -2, 2, 2, -3, 0, 4},
            {1, 3, -3, 2, -2, 2, 2, -3, 0, 4},
            {0, -2, -4, 1, -3, -4, 1, -4, -1, 1},
            {0, -2, -4, 1, -3, -4, 1, -4, -1, 1},
            {-1, 1, -5, 0, -4, 0, 0, -5, -2, 2},
            {-1, 1, -5, 0, -4, 0, 0, -5, -2, 2},
            {0, -2, -4, 1, -3, -4, 1, -4, -1, 1},
            {0, -2, -4, 1, -3, -4, 1, -4, -1, 1},
            {1, 3, -3, 2, -2, 2, 2, -3, 0, 4},
            {1, 3, -3, 2, -2, 2, 2, -3, 0, 4},
    };

    private int[][] positionalValueOfBlack3s = {
            {0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 2},
            {0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 2},
            {0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 0},
            {-2, 1000000, 1000000, -3, 1000000, 1000000, -3, 1000000, 1000000, 0},
            {-2, 1000000, 1000000, -3, 1000000, 1000000, -3, 1000000, 1000000, 2},
            {-2, 1000000, 1000000, -3, 1000000, 1000000, -3, 1000000, 1000000, 2},
            {-2, 1000000, 1000000, -3, 1000000, 1000000, -3, 1000000, 1000000, 0},
            {0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 0},
            {0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 2},
            {0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 2},
    };

    private int[][] positionalValueOfBlack4s = {
            {0, 1000000, 1000000, 1000000, -2, 1000000, 1000000, 1000000, 0, 1000000},
            {0, 1000000, 1000000, 1000000, -2, 1000000, 1000000, 1000000, 0, 1000000},
            {1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000},
            {1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000},
            {-2, 1000000, 1000000, 1000000, -5, 1000000, 1000000, 1000000, -2, 1000000},
            {-2, 1000000, 1000000, 1000000, -5, 1000000, 1000000, 1000000, -2, 1000000},
            {1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000},
            {1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000},
            {0, 1000000, 1000000, 1000000, -2, 1000000, 1000000, 1000000, 0, 1000000},
            {0, 1000000, 1000000, 1000000, -2, 1000000, 1000000, 1000000, 0, 1000000},
    };

    /**
     * Hard AI uses a 1-ply minimax algorithm based on the evaluation function to determine its next move
     * @param gameState you know what
     * @return you know what
     */
    public String getMove(GameState gameState) {
        if (api.getMyColor(gameState) == api.WHITE) {       //we are playing white
            int max = -10000000;
            int maxIndex = -1;
            int index = -1;
            ArrayList<String> myMoves = getAllLegalMoves(gameState);
            for (String myMove : myMoves) {
                index++;

                int min = 10000000;

                String newBoard[][] = tryThisMove(gameState, myMove);

                /* function start */
                String[] pieceLocations = api.getMyPieceLocations(api.BLACK, newBoard);
                ArrayList<String> opponentMoves = new ArrayList<String>();
                for (String piece : pieceLocations) {
                    if (piece.equals(""))
                        break;

                    String[] validMoves = api.getValidMoves(piece, api.BLACK, newBoard);
                    for (String move : validMoves) {
                        if (move.equals(""))
                            break;

                        opponentMoves.add(piece + ", " + move);
                    }
                }
                /* function end */

                for (String opponentMove : opponentMoves) {
                    String newNewBoard[][] = tryThisMove(newBoard, opponentMove);
                    int evaluation = evaluatePosition(newNewBoard, api.WHITE);
                    if (evaluation < min) {
                        min = evaluation;
                    }
                }

                if (min > max) {
                    max = min;
                    maxIndex = index;
                }
            }
            if (maxIndex == -1) {
                return "CHECKMATED";
            }
            return myMoves.get(maxIndex);
        } else {        //we are playing black
            int max = 10000000;
            int maxIndex = -1;
            int index = -1;
            ArrayList<String> myMoves = getAllLegalMoves(gameState);
            for (String myMove : myMoves) {
                index++;

                int min = -10000000;

                String newBoard[][] = tryThisMove(gameState, myMove);

                /* function start */
                String[] pieceLocations = api.getMyPieceLocations(api.WHITE, newBoard);
                ArrayList<String> opponentMoves = new ArrayList<String>();
                for (String piece : pieceLocations) {
                    if (piece.equals(""))
                        break;

                    String[] validMoves = api.getValidMoves(piece, api.WHITE, newBoard);
                    for (String move : validMoves) {
                        if (move.equals(""))
                            break;

                        opponentMoves.add(piece + ", " + move);
                    }
                }
                /* function end */

                for (String opponentMove : opponentMoves) {
                    String newNewBoard[][] = tryThisMove(newBoard, opponentMove);
                    int evaluation = evaluatePosition(newNewBoard, api.BLACK);
                    if (evaluation > min) {
                        min = evaluation;
                    }
                }

                if (min < max) {
                    max = min;
                    maxIndex = index;
                }
            }
            if (maxIndex == -1) {
                return "CHECKMATED";
            }
            return myMoves.get(maxIndex);
        }
    }

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

    //overloading for the opponent's trial move
    public String[][] tryThisMove(String[][] original, String moveString) {
        //for this method specifically, since we're trying to move pieces around, we need to make a deep copy
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
    
    public int evaluatePosition(String[][] board, int playerToMove) {
        int evaluation = 5 - 10 * playerToMove;   //start off by giving 5 to whoever's turn it is to move
        
        //first evaluate piece values and position values at the same time
        int numWhite1s = 0, numWhiteLF2s = 0, numWhiteRF2s = 0, numWhiteB2s = 0, numWhite3s = 0;
        String[] pieceLocations = api.getMyPieceLocations(api.WHITE, board);
        for (String piece : pieceLocations) {
            int moveDistance = api.getPieceMoveDistance(piece, board);
            if (moveDistance == 1) {
                evaluation += positionalValueOfWhite1s[api.cellToRow(piece)][api.cellToCol(piece)];
                
                numWhite1s++;
            } else if (moveDistance == 2) {
                evaluation += positionalValueOfWhite2s[api.cellToRow(piece)][api.cellToCol(piece)];
                
                if (api.cellToRow(piece) % 2 != api.WHITE) {       //back rank 2
                    numWhiteB2s++;
                } else if (api.cellToCol(piece) % 2 == api.WHITE) {  //left front rank 2
                    numWhiteLF2s++;
                } else { //right front rank 2
                    numWhiteRF2s++;
                }
            } else if (moveDistance == 3) {
                evaluation += positionalValueOfWhite3s[api.cellToRow(piece)][api.cellToCol(piece)];
                
                numWhite3s++;
            } else {  //it's a 4
                evaluation += positionalValueOfWhite4s[api.cellToRow(piece)][api.cellToCol(piece)];
            }
        }
        evaluation += pieceValueOfWhite1s[numWhite1s];
        evaluation += pieceValueOfWhiteB2s[numWhiteB2s];
        evaluation += pieceValueOfWhiteLF2s[numWhiteLF2s];
        evaluation += pieceValueOfWhiteRF2s[numWhiteRF2s];
        evaluation += pieceValueOfWhite3s[numWhite3s];
        if (numWhiteB2s >= 2 && numWhiteLF2s >= 1 && numWhiteRF2s >= 1) {
            evaluation += allFourWhite2sBonus;
        }

        int numBlack1s = 0, numBlackLF2s = 0, numBlackRF2s = 0, numBlackB2s = 0, numBlack3s = 0;
        pieceLocations = api.getMyPieceLocations(api.BLACK, board);
        for (String piece : pieceLocations) {
            int moveDistance = api.getPieceMoveDistance(piece, board);
            if (moveDistance == 1) {
                evaluation += positionalValueOfBlack1s[api.cellToRow(piece)][api.cellToCol(piece)];

                numBlack1s++;
            } else if (moveDistance == 2) {
                evaluation += positionalValueOfBlack2s[api.cellToRow(piece)][api.cellToCol(piece)];

                if (api.cellToRow(piece) % 2 != api.BLACK) {       //back rank 2
                    numBlackB2s++;
                } else if (api.cellToCol(piece) % 2 == api.BLACK) {  //left front rank 2
                    numBlackLF2s++;
                } else { //right front rank 2
                    numBlackRF2s++;
                }
            } else if (moveDistance == 3) {
                evaluation += positionalValueOfBlack3s[api.cellToRow(piece)][api.cellToCol(piece)];

                numBlack3s++;
            } else {  //it's a 4
                evaluation += positionalValueOfBlack4s[api.cellToRow(piece)][api.cellToCol(piece)];
            }
        }
        evaluation += pieceValueOfBlack1s[numBlack1s];
        evaluation += pieceValueOfBlackB2s[numBlackB2s];
        evaluation += pieceValueOfBlackLF2s[numBlackLF2s];
        evaluation += pieceValueOfBlackRF2s[numBlackRF2s];
        evaluation += pieceValueOfBlack3s[numBlack3s];
        if (numBlackB2s >= 2 && numBlackLF2s >= 1 && numBlackRF2s >= 1) {
            evaluation += allFourBlack2sBonus;
        }

        //then evaluate threat/attack values

        return evaluation;
    }
}
