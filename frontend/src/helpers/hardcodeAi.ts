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
export const helperFunctions = `// cell values are NEVER null - they should be "" if empty

const NUM_PIECES_PER_SIDE = 20; // int
const NUM_PAWNS_PER_SIDE = 9; // int
const BOARD_LENGTH = 10; // int

const MIN_MOVE_DISTANCE = 1; // int
const MAX_MOVE_DISTANCE = 4; // int

const WHITE_CHAR = 'w'; // char
const BLACK_CHAR = 'b'; // char

const VALID_MOVES_ARRAY_LENGTH = 81; // int

const TRUE = 1; // int
const FALSE = 0; // int

const WHITE = 0; // int
const BLACK = 1; // int
const NO_PIECE = -1; // int

const ERR_INVALID_COLOR = -2; // int
const ERR_INVALID_COL = -3; // int
const ERR_INVALID_ROW = -4; // int
const ERR_FORMAT = -5; // int
const ERR_FORMAT_MOVE_FROM = -6; // int
const ERR_FORMAT_MOVE_TO = -7; // int


declare var gameState: GameState;

class GameState {
    currentPlayer: number;
    numWhitePieces: number;
    numBlackPieces: number;
    numWhitePawns: number;
    numBlackPawns: number;
    numMovesMade: number;
    board: string[][];

    constructor() {
        this.currentPlayer = 0;
        this.numWhitePieces = 20;
        this.numBlackPieces = 20;
        this.numWhitePawns = 9;
        this.numBlackPawns = 9;
        this.numMovesMade = 0;

        var col9 = new Array("b1", "b1", "", "", "", "", "", "", "w1", "w3");
        var col8 = new Array("b3", "b2", "", "", "", "", "", "", "w2", "w3");
        var col7 = new Array("b2", "b2", "", "", "", "", "", "", "w2", "w2");
        var col6 = new Array("b1", "b1", "", "", "", "", "", "", "w1", "w1");
        var col5 = new Array("b4", "b1", "", "", "", "", "", "", "w1", "w4");
        var col4 = new Array("b4", "b1", "", "", "", "", "", "", "w1", "w4");
        var col3 = new Array("b1", "b1", "", "", "", "", "", "", "w1", "w1");
        var col2 = new Array("b2", "b2", "", "", "", "", "", "", "w2", "w2");
        var col1 = new Array("b3", "b2", "", "", "", "", "", "", "w2", "w3");
        var col0 = new Array("b3", "b1", "", "", "", "", "", "", "w1", "w1");

        this.board = new Array(col9, col8, col7, col6, col5, col4, col3, col2, col1, col0);
    }
}


/** 
* @return {string[][]} -           The String[][] representation of the game
                         board, comprised of ‘cells’, as described
                         at the top of this doc.
*/
function getBoard(): string[][] { // String[][]
    return gameState.board;
}


/**
    * @return {number}	-	  	 An integer representing the color of
    * 				 	 the current player.
    * 				 	 0 = WHITE  and  1 = BLACK
    */
function getMyColor(): number {
    return gameState.currentPlayer;
}

/**
 * 
 * @param {number} myColor - An integer representing the color of
    * 				 	 the not current player.
 * @returns {number}	-	  	 An integer representing the color of
    * 				 	 the not current player.
    * 				 	 0 = WHITE  and  1 = BLACK
     * 				 	 Returns a negative integer, ERR_INVALID_COLOR,
     * 				 	 if myColor is invalid
 */
function getOpponentColor(myColor: number): number {
    if (myColor === WHITE)
        return BLACK;
    else if (myColor === BLACK)
        return WHITE;
    else
        return ERR_INVALID_COLOR;
}




/*
--------------------
    Data Access
--------------------
*/


/**
* @param {string} cell -  The position of the cell on the board, from
*				 values “A0” to “J9”.
* @param {any} unusedParam -  Unused parameter for overloading
*
* @return {string}    -    The two-character representation of a ‘cell’,
*			  	 with “” being an empty cell with no piece, and
*			  	 “b1” representing one the black-side player’s
*			  	 1 pieces.
*/
function getCellValue(cell: string, unusedParam: any): string;
/**
 * @param {number} col -   The index of the target cell’s column in the
 *				 String[][] board, retrieved through using
    *				 cellToCol().
    * @param {number} row -   The index of the target cell’s row in the
    *				 String[][] board, retrieved through using
    *				 cellToRow().
    * @return {string} -       The two-character representation of a ‘cell’,
    *			  	 with “” being an empty cell with no piece, and
    *			  	 “b1” representing one the black-side player’s
    *			  	 1 pieces.
    */
function getCellValue(col: number, row: number): string;

function getCellValue(arg1: any, arg2: any): string {
    // getCellValue(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell: string = arg1;
        var foundVal = getCellValue(cellToCol(cell), cellToRow(cell));

        if (foundVal === null || foundVal.length != 2)
            return "";

        return foundVal;
    }

    // getCellValue(col, row)
    var col: number = arg1;
    var row: number = arg2;
    var board = gameState.board;
    return board[col][row];
}



/*
--------------------
    Array Indexing
--------------------
*/



/**
* @param {string}  cell -   The position of the cell on the board, from values “A0” to “J9”.
* 
* @return {number} -       The index of the target cell’s column in the
*				 String[][] board.
*                Returns a negative integer if an error occurs.
*
* 		         Returns ERR_INVALID_COL if cell's column
*                is a character outside of the range A-J.
*                Returns ERR_INVALID_ROW if cell's row
*                is a character outside of the range 0-9.
*                Returns ERR_FORMAT if the cell is
*                otherwise improperly formatted.
*/
function cellToCol(cell: string): number {
    var isCellValidRet = isCellValid(cell, null);
    if (isCellValidRet != TRUE)
        return isCellValidRet;

    return cellToColChar(cell) - 'A'.charCodeAt(0);
}



/**
* @param {string} cell -  The position of the cell on the board, from
* 				 values “A0” to “J9”.
* @return {number} -       The index of the target cell’s row in the
*				 String[][] board.
*                Returns a negative integer if an error occurs.
*
* 		         Returns ERR_INVALID_COL if cell's column
*                is a character outside of the range A-J.
*                Returns ERR_INVALID_ROW if cell's row
*                is a character outside of the range 0-9.
*                Returns ERR_FORMAT if the cell is
*                otherwise improperly formatted.
*/
function cellToRow(cell: string): number {
    var isCellValidRet = isCellValid(cell, null);
    if (isCellValidRet != TRUE)
        return isCellValidRet;

    return parseInt(cell.substring(1));
}

/**
 * 
 * @param {string} cell - The position of the cell on the board, from
 * 				 values "A0" to "J9".
 * 
 * @return {number} -     The column of the cell on the board, from
 * 				 characters A-J as an ASCII integer.
 * 
 *				 See Board documention
    */
function cellToColChar(cell: string): number {
    return cell.charCodeAt(0);
}

/**
 * 
 * @param {string} cell - The position of the cell on the board, from
 * 				 values "A0" to "J9".
 * @return {number} -     The row of the cell on the board, from
 * 				 characters A-J as an ASCII number.
 *
 *				 See Board documention
    */
function cellToRowChar(cell: string): number {
    return cell.charCodeAt(1);
}


/*
----------------------
Array Index Conversion
----------------------
*/



/**
* @param {number} col -   The index of the target col’s row in the
* 				 String[][] board.
*
* @return {string} -      The column of the cell on the board, from
*				 characters A-J. See diagram at top of doc as a string of length 1.
*/
function colToColChar(col: number): string {
    return String.fromCharCode(col + 'A'.charCodeAt(0));
}



/**
* @param {number} row -   The index of the target row’s row in the
* 				 String[][] board.
*
* @return {string} -      The row of the cell on the board, from
*				 characters 0-9. See diagram at top of doc as a string of length 1.
*/
function rowToRowChar(row: number): string {
    return String.fromCharCode(row).charAt(0);
}



/**
* @param {number} col -   The index of the target cell’s column in the
* 				 String[][] board, retrieved through using
* 				 cellToCol().
* @param {number} row -   The index of the target cell’s row in the
* 				 String[][] board, retrieved through using
* 				 cellToRow().
* @return {string}       The two-character position of the cell on the
* 				 board, from values “A0” to “J9”, that
* 				 corresponds to the passed row and column
* 				 indices.
*			 	 For example, colAndRowToCell(2, 4) returns “C4”
*/
function colAndRowToCell(col: number, row: number): string {
    return "" + colToColChar(col) + rowToRowChar(row);
}


/*
----------------------
Simple Cell Evaluation
----------------------
*/



/**
* @param {string} cell -  The position of the cell on the board, from
* 				 values “A0” to “J9”.
* @param {any} unusedParam -  Unused parameter for overloading
* 
* @return {number} -      Returns TRUE if the given cell is storing a
* 				 string representing a piece, like “b3” or “w1”.
* 				 False if the cell is storing “”.
* 				 Returns a negative integer if an error
* 				 occurs.
* 
*		         Returns ERR_INVALID_COL if the passed cell’s
* 				 column is an invalid character.
*                Returns ERR_INVALID_ROW if the passed cell’s
* 				 row is an invalid character.
* 				 Returns ERR_FORMAT if the passed cell is
* 				 otherwise improperly formatted.
*/
function cellHasPiece(cell: string, unusedParam: any): number;
/**
 * @param {number} col -   The index of the target cell’s column in the
 * 				 String[][] board, retrieved through using
 * 				 cellToCol().
 * @param {number} row -   The index of the target cell’s row in the
 * 				 String[][] board, retrieved through using
 * 				 cellToRow().
 *
 * @return {number} -      Returns TRUE if the given cell is storing a
 * 				 string representing a piece, like “b3” or “w1”.
 * 				 False if the cell is storing “”.
 * 				 Returns a negative integer if an error
 * 				 occurs.
 *
 *		         Returns ERR_INVALID_COL if the passed cell’s
    * 				 column is an invalid character.
    *                Returns ERR_INVALID_ROW if the passed cell’s
    * 				 row is an invalid character.
    * 				 Returns ERR_FORMAT if the passed cell is
    * 				 otherwise improperly formatted.
    */
function cellHasPiece(col: number, row: number): number;


function cellHasPiece(arg1: any, arg2: any): number {
    // cellHasPiece(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell: string = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

        // sets up args to pass to overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }

    // cellHasPiece(col, row)
    var col: number = arg1;
    var row: number = arg2;
    var isCellValidRet = isCellValid(col, row);
    if (isCellValidRet != TRUE)
        return isCellValidRet;

    return !(getCellValue(col, row) === "") ? TRUE : FALSE;
}



/**
* @param {string} cell -  The position of the cell on the board, from
* 				 values “A0” to “J9”.
* @param {number} myColor - The integer representing your color WHITE=0, BLACK=1
* @param {any} unusedParam -  Unused parameter for overloading
* @return {number} -      Returns TRUE if the given cell is storing a
* 				 string representing a piece of yours.  I.e.
* 				 “b3” if you are on black-side.
* 				 Returns FALSE if the above condition isn’t met.
* 				 Returns a negative integer if an error
* 				 occurs.
* 		         Returns ERR_INVALID_COL if the passed cell’s
*				 column is an invalid character.
*                Returns ERR_INVALID_ROW if the passed cell’s
* 				 row is an invalid character.
* 				 Returns ERR_FORMAT if the passed cell is
* 				 otherwise improperly formatted.
*/
function isMyPiece(cell: string, myColor: number, unusedParam: any): number;
/**
 * @param {number} col -   The index of the target cell’s column in the
 * 				 String[][] board, retrieved through using
 * 				 cellToCol().
 * @param {number} row -   The index of the target cell’s row in the
 * 				 String[][] board, retrieved through using
 * 				 cellToRow().
 * @param {number} myColor - The integer representing your color WHITE=0, BLACK=1
 * @return {number} -      Returns TRUE if the given cell is storing a
 * 				 string representing a piece of yours.  I.e.
 * 				 “b3” if you are on black-side.
 * 				 Returns FALSE if the above condition isn’t met.
 * 				 Returns a negative integer if an error
 * 				 occurs.
 * 		         Returns ERR_INVALID_COL if the passed cell’s
 *				column is an invalid character.
    *				Returns ERR_INVALID_ROW if the passed cell’s
    *				row is an invalid character.
    *				Returns ERR_FORMAT if the passed cell is
    *				otherwise improperly formatted.
    */
function isMyPiece(col: number, row: number, myColor: number): number;

function isMyPiece(arg1: any, arg2: any, arg3: any): number {
    // isMyPiece(cell, myColor, unusedParam)
    if (typeof arg1 === 'string') {
        var cell: string = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

        // sets up args to pass to overload
        arg3 = arg2;
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }

    // isMyPiece(col, row, myColor)
    var col: number = arg1;
    var row: number = arg2;
    var myColor: number = arg3;
    var isCellValidRet = isCellValid(col, row);
    if (isCellValidRet != TRUE)
        return isCellValidRet;

    return getPieceColor(col, row) === myColor ? TRUE : FALSE;
}

/**
* @param {string} cell -  The position of the cell on the board, from
* 				 values “A0” to “J9”.
* @param {any} unusedParam -  Unused parameter for overloading
* @return {number} -      An integer representing the color/owner of the
* 				 piece.  0 = WHITE, 1 = BLACK, and -1 = NO_PIECE
* 				 Returns a negative integer if an error
* 				 occurs.
*		         Returns ERR_INVALID_COL if the passed cell’s
* 				 column is an invalid character.
*                Returns ERR_INVALID_ROW if the passed cell’s
* 				 row is an invalid character.
* 				 Returns ERR_FORMAT if the passed cell is
* 				 otherwise improperly formatted.
*/
function getPieceColor(cell: string, unusedParam: any): number;
/**
 * @param {number} col -   The index of the target cell’s column in the
 * 				 String[][] board, retrieved through using
 * 				 cellToCol().
 * @param {number} row -   The index of the target cell’s row in the
 * 				 String[][] board, retrieved through using
 * 				 cellToRow().
 * @return {number} -      An integer representing the color/owner of the
 * 				 piece.  0 = WHITE, 1 = BLACK, and -1 = NO_PIECE
 * 				 Returns a negative integer if an error
 * 				 occurs.
 *		         Returns ERR_INVALID_COL if the passed cell’s
    * 				 column is an invalid character.
    *                Returns ERR_INVALID_ROW if the passed cell’s
    * 				 row is an invalid character.
    * 				 Returns ERR_FORMAT if the passed cell is
    * 				 otherwise improperly formatted.
    */
function getPieceColor(col: number, row: number): number;


function getPieceColor(arg1: any, arg2: any): number {
    // getPieceColor(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell: string = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

        // sets up args to pass into overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }

    // getPieceColor(col, row)
    var col: number = arg1;
    var row: number = arg2;
    var isCellValidRet = isCellValid(col, row);
    if (isCellValidRet != TRUE)
        return isCellValidRet;

    if (cellHasPiece(col, row) === FALSE)
        return NO_PIECE;

    var cellVal = getCellValue(col, row);
    var colorChar = cellVal.charAt(0);

    var returnColor;
    if (colorChar === WHITE_CHAR)
        returnColor = WHITE;
    else if (colorChar === BLACK_CHAR)
        returnColor = BLACK;
    else
        returnColor = NO_PIECE;

    return returnColor;
}

/**
* @param {string} cell -  The position of the cell on the board, from
* 				 values “A0” to “J9”.
* @param {any} unusedParam -  Unused parameter for overloading
* @return {number} -      An integer representing the color/owner of the
* 				 piece.  0 = WHITE, 1 = BLACK, and -1 = NO_PIECE
* 				 Returns a negative integer if an error
* 				 occurs.
* 		         Returns ERR_INVALID_COL if the passed cell’s
* 				 column is an invalid character.
*                Returns ERR_INVALID_ROW if the passed cell’s
* 				 row is an invalid character.
* 				 Returns ERR_FORMAT if the passed cell is
* 				 otherwise improperly formatted.
*/
function getPieceMoveDistance(cell: string, unusedParam: any): number;
/**
 * @param {number} col -   The index of the target cell’s column in the
 * 				 String[][] board, retrieved through using
 * 				 cellToCol().
 * @param {number} row -   The index of the target cell’s row in the
 * 				 String[][] board, retrieved through using
 * 				 cellToRow().
 * @return {number} -      An integer representing the color/owner of the
 * 				 piece.  0 = WHITE, 1 = BLACK, and -1 = NO_PIECE
 * 				 Returns a negative integer if an error
 * 				 occurs.
 * 		         Returns ERR_INVALID_COL if the passed cell’s
 * 				 column is an invalid character.
 *                Returns ERR_INVALID_ROW if the passed cell’s
 * 				 row is an invalid character.
 * 				 Returns ERR_FORMAT if the passed cell is
 * 				 otherwise improperly formatted.
 */
function getPieceMoveDistance(col: number, row: number): number;


function getPieceMoveDistance(arg1: any, arg2: any): number {
    // getPieceMoveDistance(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell: string = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

        // sets up args to pass into overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }

    // getPieceMoveDistance(col, row)
    var col: number = arg1;
    var row: number = arg2;
    var isCellValidRet = isCellValid(col, row);
    if (isCellValidRet != TRUE)
        return isCellValidRet;

    if (cellHasPiece(col, row) === FALSE)
        return 0;

    var cellVal = getCellValue(col, row);
    return parseInt(cellVal.substring(1));
}


/*
--------------------
    Strategy Helpers
--------------------
*/

/**
 * 
 * @param {number} color - An integer representing the color of 
 * 				 the current player.
 * @return	{string[]}	- An array of cells that pieces of the specified
 * 				 color are in.  The array is of fixed length 20,
 * 				 with empty array entries having the value "".
 */
function getMyPieceLocations(color: number): string[] {
    var locations: string[] = new Array(NUM_PIECES_PER_SIDE);
    for (var i = 0; i < NUM_PIECES_PER_SIDE; i++)
        locations[i] = "";

    var curArrIndex = 0;

    for (var i = 0; i < BOARD_LENGTH; i++) {
        for (var j = 0; j < BOARD_LENGTH; j++) {
            if (isMyPiece(i, j, color) === TRUE) {
                locations[curArrIndex] = colAndRowToCell(i, j);
                curArrIndex++;
            }
        }
    }

    return locations;
}

/**
* @param {string} cell -  The position of the cell on the board, from
* 				 values “A0” to “J9”.
* @param {number} myColor - The integer representing your color WHITE=0, BLACK=1
* @param {any} unusedParam -  Unused parameter for overloading
* @return {string[]} -      An array of all cell positions that the piece
* 				 in the current cell can move to, represented
* 				 like [“E7”, “G7”, “E6”, “H8”].  If the owner of
*/
function getValidMoves(cell: string, myColor: number, unusedParam: any): string[];
/**
 * @param {number} col -   The index of the target cell’s column in the
 * 				 String[][] board, retrieved through using
 * 				 cellToCol().
 * @param {number} row -   The index of the target cell’s row in the
 * 				 String[][] board, retrieved through using
 * 				 cellToRow().
 * @param {number} myColor - The integer representing your color WHITE=0, BLACK=1
 * @return {string[]} -      An array of all cell positions that the piece
 * 				 in the current cell can move to, represented
 * 				 like [“E7”, “G7”, “E6”, “H8”].  If the owner of
 */
function getValidMoves(col: number, row: number, myColor: number): string[];


function getValidMoves(arg1: any, arg2: any, arg3: any): string[] {
    // getValidMoves(cell, myColor, unusedParam)
    if (typeof arg1 === 'string') {
        var cell: string = arg1;

        // sets up args to pass into overload
        arg3 = arg2;
        arg2 = cellToRow(cell);
        arg1 = cellToCol(cell);
    }

    // getValidMoves(col, row, myColor);
    var col: number = arg1;
    var row: number = arg2;
    var myColor: number = arg3;
    var moves: string[] = new Array(VALID_MOVES_ARRAY_LENGTH);

    for (var i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {
        moves[i] = "";
    }

    var currentArrayIndex = 0;
    var moveDistance = getPieceMoveDistance(col, row);

    if (moveDistance <= 0)
        return moves;

    for (var i = -moveDistance; i <= moveDistance; i += moveDistance) {			//William, you almost got it right. I just need to change two places in the code, i++ and j++
        for (var j = -moveDistance; j <= moveDistance; j += moveDistance) {		//to i += moveDistance and j += moveDistance ! Plus corresponding code in SimulationApp
            var newCol = col + i;
            var newRow = row + j;

            if ((isCellValid(newCol, newRow) === TRUE)
                && isMyPiece(newCol, newRow, myColor) != TRUE) {
                var pieceColor = getPieceColor(col, row);
                /*if (isPlayerInCheck(pieceColor) === TRUE && ((pieceColor === WHITE && row != 0) || (pieceColor === BLACK && row != 9)))
                    continue;*/
                if (isPlayerInCheck(pieceColor) === TRUE) {
                    var columnInCheck = whichColumnIsPlayerInCheck(pieceColor);
                    var rowToCheck = (pieceColor === WHITE) ? 9 : 0;
                    if (newCol != columnInCheck || newRow != rowToCheck)
                        continue;
                }
                moves[currentArrayIndex] = colAndRowToCell(newCol, newRow);
                currentArrayIndex++;
            }
        }
    }

    return moves;
}



/**
* @param {number} color - An integer representing the color of
* 			     the current player.
* 			     0 = WHITE  and  1 = BLACK

* @return {number} -      Returns TRUE if the given player’s opponent has
                    gotten a 1-piece of theirs to the given
                    player’s starting side of the board.  Only
                    moves that capture this 1-piece will be valid,
                    and failure to capture it will result in a
                    checkmate.
                    Returns FALSE if the given player’s opponent
                    does not meet the above condition.
                    Returns a negative integer if an
                    error occurs.

* 		         Returns ERR_INVALID_COLOR if the passed color
                    is not WHITE or BLACK.
*/

// similar func in GameState
function isPlayerInCheck(color: number): number {
    var rowToCheck;

    if (color === WHITE)
        rowToCheck = 9;
    else if (color === BLACK)
        rowToCheck = 0;
    else
        return ERR_INVALID_COLOR;

    for (var i = 0; i < BOARD_LENGTH; i++) {
        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))
            && (getPieceMoveDistance(i, rowToCheck) === 1))
            return TRUE;
    }

    return FALSE;
}

/**
 * @param {number} color  An integer representing the color of
 * 			     the current player.
 * 			     0 = WHITE  and  1 = BLACK

    * @return {number} -      Assumes the given player’s opponent has
gotten a 1-piece of theirs to the given
player’s starting side of the board, and returns the column that 1-piece is in.  Only
moves that capture this 1-piece will be valid,
and failure to capture it will result in a
checkmate.
Returns a negative integer if an
error occurs.

Returns NO_PIECE if the given player’s opponent
does not meet the above condition.

    * 		         Returns ERR_INVALID_COLOR if the passed color
is not WHITE or BLACK.
    */

function whichColumnIsPlayerInCheck(color: number): number {
    var rowToCheck;

    if (color === WHITE)
        rowToCheck = 9;
    else if (color === BLACK)
        rowToCheck = 0;
    else
        return ERR_INVALID_COLOR;

    for (var i = 0; i < BOARD_LENGTH; i++) {
        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))
            && (getPieceMoveDistance(i, rowToCheck) === 1))
            return i;
    }

    return NO_PIECE;
}


/*
--------------------
        Validation
--------------------
*/



/**
* @param {string} moveString - A string representation of a move of
* 					  piece from one cell to another cell, in the
* 					  format: “<cellFrom>, <cellTo>”.  ‘cellFrom’
* 					  refers to the cell that a piece starts in, and
* 					  ‘cellTo’ refers to the cell that the piece will
* 					  land in.
* 					  For example, “A2, B2” is moving the piece
* 					  currently in cell A2 to cell B2.
* @param {number} myColor - The integer representing your color WHITE=0, BLACK=1
* @param {any} unusedParam -  Unused parameter for overloading
* @return {number} -      Returns TRUE if the passed move is valid.
*			  	 Returns FALSE if the passed move is properly
* 				 formatted, but invalid.
* 				 Returns a negative integer if an error
* 				 occurs.
* 		         Returns ERR_FORMAT_MOVE_FROM if the string
* 				 representing the fromCell is invalid.
* 				 Returns ERR_FORMAT_MOVE_TO if the string
* 				 representing the toCell is invalid.
* 				 otherwise improperly formatted.
* 				 Returns ERR_FORMAT if the passed move is
* 				 otherwise improperly formatted.
*/
function isMoveValid(moveString: string, myColor: number, unusedParam: any): number;
/**
 * @param {string} fromCell -  A string representation of the cell that
 * 					  a piece starts in, with values "A0"-"J9".
 * @param {string} toCell   A string representation of the cell that
 * 					  a piece will land in, with values "A0"-"J9".
 * @param {number} myColor - The integer representing your color WHITE=0, BLACK=1
 * @return {number} -      Returns TRUE if the passed move is valid.
 *			  	 Returns FALSE if the passed move is properly
    * 				 formatted, but invalid.
    * 				 Returns a negative integer if an error
    * 				 occurs.
    * 		         Returns ERR_FORMAT_MOVE_FROM if the string
    * 				 representing the fromCell is invalid.
    * 				 Returns ERR_FORMAT_MOVE_TO if the string
    * 				 representing the toCell is invalid.
    * 				 otherwise improperly formatted.
    * 				 Returns ERR_FORMAT if the passed move is
    * 				 otherwise improperly formatted.
    */
function isMoveValid(fromCell: string, toCell: string, myColor: number): number;



function isMoveValid(arg1: any, arg2: any, arg3: any): number {
    // isMoveValid(moveString, myColor, unusedParam)
    if (typeof arg2 === 'number') {
        var moveString: string = arg1;
        var moveCells = moveString.split(", ");

        if (moveCells.length != 2)
            return ERR_FORMAT;


        // sets up args to pass into overload
        arg3 = arg2;
        arg1 = moveCells[0];
        arg2 = moveCells[1];
    }

    // isMoveValid(fromCell, toCell, myColor)
    var fromCell: string = arg1;
    var toCell: string = arg2;
    var myColor: number = arg3;
    if (fromCell === null || toCell === null || fromCell.length != 2 || toCell.length != 2)
        return ERR_FORMAT;

    var cellValidRet = isCellValid(fromCell, null);
    if (cellValidRet != TRUE)
        return ERR_FORMAT_MOVE_FROM;

    cellValidRet = isCellValid(toCell, null);
    if (cellValidRet != TRUE)
        return ERR_FORMAT_MOVE_TO;

    var pieceMoveDistance = getPieceMoveDistance(fromCell, null);

    if (pieceMoveDistance === 0 || isMyPiece(fromCell, myColor, null) != TRUE || isMyPiece(toCell, myColor, null) === TRUE)
        return FALSE;

    if ((Math.abs(cellToRow(fromCell) - cellToRow(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance)
        || (Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance))
        return FALSE;

    return TRUE;
}

/**
* @param {string} cell -  The position of the cell on the board, from
* 				 values “A0” to “J9”.
* @param {any} unusedParam -  Unused parameter for overloading
* @return {number} -      Returns TRUE, a positive integer, if the passed
* 				 cell is valid.
* 				 Returns a negative integer if it’s invalid,
* 				 causing an error.
* 		         Returns ERR_INVALID_COL if the passed cell’s
* 				 column is an invalid character.
*                Returns ERR_INVALID_ROW if the passed cell’s
* 				 row is an invalid character.
* 				 Returns ERR_FORMAT if the passed cell is
* 				 otherwise improperly formatted.
*/
function isCellValid(cell: string, unusedParam: any): number;
/**
 * @param {number} col -   The index of the target cell’s column in the
 * 				 String[][] board, retrieved through using
 * 				 cellToCol().
 * @param {number} row -   The index of the target cell’s row in the
 * 				 String[][] board, retrieved through using
 * 				 cellToRow().
 * @return {number} -      Returns TRUE, a positive integer, if the passed
 * 				 cell is valid.
 * 				 Returns a negative integer if it’s invalid,
 * 				 causing an error.
 * 		         Returns ERR_INVALID_COL if the passed cell’s
 * 				 column is an invalid character.
 *                Returns ERR_INVALID_ROW if the passed cell’s
 * 				 row is an invalid character.
 * 				 Returns ERR_FORMAT if the passed cell is
 * 				 otherwise improperly formatted.
 */
function isCellValid(col: number, row: number): number;


function isCellValid(arg1: any, arg2: any): number {
    // isCellValid(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell: string = arg1;
        if (cell === null || cell.length != 2)
            return ERR_FORMAT;

        var colChar = cell.charAt(0);
        var rowChar = cell.charAt(1);

        if (colChar < 'A' || colChar > 'J')
            return ERR_INVALID_COL;

        if (rowChar < '0' || rowChar > '9')
            return ERR_INVALID_ROW;

        return TRUE;
    }

    // isCellVAlid(col, row)
    var col: number = arg1;
    var row: number = arg2;
    if (col < 0 || col > 9)
        return ERR_INVALID_COL;
    if (row < 0 || row > 9)
        return ERR_INVALID_ROW;

    return TRUE;
}
`
export const devComplete = `
function getMove() {
    var board: string[][] = gameState.board;
    var pieceLocations: string[] = getMyPieceLocations(getMyColor());

    var numMovesFound: number = 0;
    var moves: string[] = new Array(NUM_PIECES_PER_SIDE);
    for (var i: number = 0; i < NUM_PIECES_PER_SIDE; i++) {
        var piece: string = pieceLocations[i];
        if (piece === "")
            break;

        var validMoves: string[] = getValidMoves(piece, getMyColor(), null);
        for (var j: number = 0; j < VALID_MOVES_ARRAY_LENGTH; j++) {
            var move: string = validMoves[j];
            if (move === "")
                break;

            moves[numMovesFound] = piece + ", " + move;
            numMovesFound++;
        }

        if (numMovesFound === 0) {				//if you have no legal moves, that means you are checkmated
            return "CHECKMATED";
        }
        return moves[Math.floor((Math.random() * numMovesFound))];
    }
}`