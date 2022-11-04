// eslint-disable-next-line no-useless-escape
export const developerAi = 'package Strategy;\n\nimport API.API;\nimport Simulation.GameState;\nimport Strategy.Strategy;\n\nimport java.util.ArrayList;\n\npublic class StarterCode implements Strategy {\n    /**\n     * API containing helper functions\n     */\n    private API api;\n\n    public StarterCode() {\n        api = new API();\n    }\n\n    /**\n     * Please refer to the API for helper functions to code your starter AI\n     *\n     * @param gameState the current state of the game\n     * @return a random move TODO change to return your choice of move\n     */\n    public String getMove(GameState gameState) {\n        /* HINT: use the .isEmpty() and .size() methods of ArrayList\n         * to see how many (if any) of a certain type of move exists\n         */\n\n        if (false /* insert your choice of condition */) {\n            /* insert your choice of return move */\n        }\n        if (false /* insert your choice of return move */) {\n            /* insert your choice of return move */\n        }\n\n        return getRandomMove(gameState);\n    }\n\n    /**\n     * Returns a legal random move given the current game state (i.e. must escape check).\n     *\n     * If no legal move exists, returns \"CHECKMATED\" to indicate one has lost\n     * @param gameState the current state of the game\n     * @return a random move\n     */\n    public String getRandomMove(GameState gameState) {\n        ArrayList<String> moves = getAllLegalMoves(gameState);\n\n        if (moves.size() == 0) {\t\t\t\t//if you have no legal moves, that means you are checkmated\n            return \"CHECKMATED\";\n        }\n        return moves.get((int)(Math.random() * moves.size()));\n    }\n\n    /**\n     *\n     * Returns all legal moves\n     *\n     * @param gameState the current state of the game\n     * @return an arraylist containing all legal moves\n     */\n    public ArrayList<String> getAllLegalMoves(GameState gameState) {\n        String board[][] = api.getBoard(gameState);\n        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);\n\n        ArrayList<String> moves = new ArrayList<String>();\n        for (String piece : pieceLocations) {\n            if (piece.equals(\"\"))\n                break;\n\n            String[] validMoves = api.getValidMoves(piece, api.getMyColor(gameState), board);\n            for (String move : validMoves) {\n                if (move.equals(\"\"))\n                    break;\n\n                moves.add(piece + \", \" + move);\n            }\n        }\n        return moves;\n    }\n\n    /**\n     * Returns all legal moves that capture (not trade) a piece\n     *\n     * @param gameState the current state of the game\n     * @return an arraylist containing all legal moves that capture (not trade) a piece\n     */\n    public ArrayList<String> getAllLegalCaptureMoves(GameState gameState) {\n        String board[][] = api.getBoard(gameState);\n        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);\n\n        ArrayList<String> moves = new ArrayList<String>();\n        for (String piece : pieceLocations) {\n            if (piece.equals(\"\"))\n                break;\n\n            String[] validMoves = api.getValidMoves(piece, api.getMyColor(gameState), board);\n            for (String move : validMoves) {\n                if (move.equals(\"\"))\n                    break;\n\n                //a valid move is guaranteed to land on either an empty space or one with an opposing piece\n                if (api.getPieceMoveDistance(move, board) != 0 &&\n                        api.getPieceMoveDistance(piece, board) > api.getPieceMoveDistance(move, board)) {\n                    moves.add(piece + \", \" + move);\n                }\n            }\n        }\n        return moves;\n    }\n\n    /**\n     * Returns all legal moves that capture (not trade) a 1-piece\n     *\n     * @param gameState the current state of the game\n     * @return an arraylist containing all legal moves that capture (not trade) a 1-piece\n     */\n    public ArrayList<String> getAllLegalCapture1PieceMoves(GameState gameState) {\n        String board[][] = api.getBoard(gameState);\n        String[] pieceLocations = api.getMyPieceLocations(api.getMyColor(gameState), board);\n\n        ArrayList<String> moves = new ArrayList<String>();\n        for (String piece : pieceLocations) {\n            if (piece.equals(\"\"))\n                break;\n\n            String[] validMoves = api.getValidMoves(piece, api.getMyColor(gameState), board);\n            for (String move : validMoves) {\n                if (move.equals(\"\"))\n                    break;\n\n                //a valid move is guaranteed to land on either an empty space or one with an opposing piece\n                if (api.getPieceMoveDistance(move, board) == 1 &&\n                        api.getPieceMoveDistance(piece, board) > api.getPieceMoveDistance(move, board)) {\n                    moves.add(piece + \", \" + move);\n                }\n            }\n        }\n        return moves;\n    }\n}'
export const easyAi = `// cell values are NEVER null - they should be "" if empty
var NUM_PIECES_PER_SIDE = 20; // int
var NUM_PAWNS_PER_SIDE = 9; // int
var BOARD_LENGTH = 10; // int
var MIN_MOVE_DISTANCE = 1; // int
var MAX_MOVE_DISTANCE = 4; // int
var WHITE_CHAR = 'w'; // char
var BLACK_CHAR = 'b'; // char
var VALID_MOVES_ARRAY_LENGTH = 81; // int
var TRUE = 1; // int
var FALSE = 0; // int
var WHITE = 0; // int
var BLACK = 1; // int
var NO_PIECE = -1; // int
var ERR_INVALID_COLOR = -2; // int
var ERR_INVALID_COL = -3; // int
var ERR_INVALID_ROW = -4; // int
var ERR_FORMAT = -5; // int
var ERR_FORMAT_MOVE_FROM = -6; // int
var ERR_FORMAT_MOVE_TO = -7; // int
var GameState = /** @class */ (function () {
    function GameState() {
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
    return GameState;
}());
/**
 * @return {string[][]} -           The String[][] representation of the game
 board, comprised of ‘cells’, as described
 at the top of this doc.
 */
function getBoard() {
    return gameState.board;
}
/**
 * @return {number}	-	  	 An integer representing the color of
 * 				 	 the current player.
 * 				 	 0 = WHITE  and  1 = BLACK
 */
function getMyColor() {
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
function getOpponentColor(myColor) {
    if (myColor === WHITE)
        return BLACK;
    else if (myColor === BLACK)
        return WHITE;
    else
        return ERR_INVALID_COLOR;
}
function getCellValue(arg1, arg2) {
    // getCellValue(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var foundVal = getCellValue(cellToCol(cell), cellToRow(cell));
        if (foundVal === null || foundVal.length != 2)
            return "";
        return foundVal;
    }
    // getCellValue(col, row)
    var col = arg1;
    var row = arg2;
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
function cellToCol(cell) {
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
function cellToRow(cell) {
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
function cellToColChar(cell) {
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
function cellToRowChar(cell) {
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
function colToColChar(col) {
    return String.fromCharCode(col + 'A'.charCodeAt(0));
}
/**
 * @param {number} row -   The index of the target row’s row in the
 * 				 String[][] board.
 *
 * @return {string} -      The row of the cell on the board, from
 *				 characters 0-9. See diagram at top of doc as a string of length 1.
 */
function rowToRowChar(row) {
    return ("" + row).charAt(0);
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
function colAndRowToCell(col, row) {
    return "" + colToColChar(col) + rowToRowChar(row);
}
function cellHasPiece(arg1, arg2) {
    // cellHasPiece(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass to overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // cellHasPiece(col, row)
    var col = arg1;
    var row = arg2;
    var isCellValidRet = isCellValid(col, row);
    if (isCellValidRet != TRUE)
        return isCellValidRet;
    return !(getCellValue(col, row) === "") ? TRUE : FALSE;
}
function isMyPiece(arg1, arg2, arg3) {
    // isMyPiece(cell, myColor, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass to overload
        arg3 = arg2;
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // isMyPiece(col, row, myColor)
    var col = arg1;
    var row = arg2;
    var myColor = arg3;
    var isCellValidRet = isCellValid(col, row);
    if (isCellValidRet != TRUE)
        return isCellValidRet;
    return getPieceColor(col, row) === myColor ? TRUE : FALSE;
}
function getPieceColor(arg1, arg2) {
    // getPieceColor(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass into overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // getPieceColor(col, row)
    var col = arg1;
    var row = arg2;
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
function getPieceMoveDistance(arg1, arg2) {
    // getPieceMoveDistance(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass into overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // getPieceMoveDistance(col, row)
    var col = arg1;
    var row = arg2;
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
function getMyPieceLocations(color) {
    var locations = new Array(NUM_PIECES_PER_SIDE);
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
function getValidMoves(arg1, arg2, arg3) {
    // getValidMoves(cell, myColor, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        // sets up args to pass into overload
        arg3 = arg2;
        arg2 = cellToRow(cell);
        arg1 = cellToCol(cell);
    }
    // getValidMoves(col, row, myColor);
    var col = arg1;
    var row = arg2;
    var myColor = arg3;
    var moves = new Array(VALID_MOVES_ARRAY_LENGTH);
    for (var i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {
        moves[i] = "";
    }
    var currentArrayIndex = 0;
    var moveDistance = getPieceMoveDistance(col, row);
    if (moveDistance <= 0)
        return moves;
    for (var i = -moveDistance; i <= moveDistance; i += moveDistance) { //William, you almost got it right. I just need to change two places in the code, i++ and j++
        for (var j = -moveDistance; j <= moveDistance; j += moveDistance) { //to i += moveDistance and j += moveDistance ! Plus corresponding code in SimulationApp
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
function isPlayerInCheck(color) {
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
function whichColumnIsPlayerInCheck(color) {
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
function isMoveValid(arg1, arg2, arg3) {
    // isMoveValid(moveString, myColor, unusedParam)
    if (typeof arg2 === 'number') {
        var moveString = arg1;
        var moveCells = moveString.split(", ");
        if (moveCells.length != 2)
            return ERR_FORMAT;
        // sets up args to pass into overload
        arg3 = arg2;
        arg1 = moveCells[0];
        arg2 = moveCells[1];
    }
    // isMoveValid(fromCell, toCell, myColor)
    var fromCell = arg1;
    var toCell = arg2;
    var myColor = arg3;
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
function isCellValid(arg1, arg2) {
    // isCellValid(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
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
    var col = arg1;
    var row = arg2;
    if (col < 0 || col > 9)
        return ERR_INVALID_COL;
    if (row < 0 || row > 9)
        return ERR_INVALID_ROW;
    return TRUE;
}


var turnNumber = 0;

function getMove() {
    turnNumber++;

    var board = getBoard();
    var pieceLocations = getMyPieceLocations(getMyColor());

    switch (turnNumber) {
        case 1:
            if (getMyColor() === 0) {    //we are playing white
                if (board[1][3] === ("b3") || board[4][3] === ("b3")) {
                    return "F9, F5";            //move the RIGHT 4 if opponent moved the LEFT 3
                } else if (board[5][3] === "b3" || board[9][3] === "b3") {
                    return "E9, E5";            //move the LEFT 4 if opponent moved the RIGHT 3
                } else {
                    moves = new Array("E9, E5", "F9, F5");      //pick randomly
                    return moves[Math.floor((Math.random() * moves.length))];
                }
            } else {                            //we are playing black
                if (board[1][6] === ("w3") || board[4][6] === ("w3")) {
                    return "F0, F4";            //move the RIGHT 4 if opponent moved the LEFT 3
                } else if (board[5][6] === ("w3") || board[9][6] === ("w3")) {
                    return "E0, E4";            //move the LEFT 4 if opponent moved the RIGHT 3
                } else {
                    moves = new Array("E0, E4", "F0, F4");      //pick randomly
                    return moves[Math.floor((Math.random() * moves.length))];
                }
            }
        case 2:
            if (getMyColor() === 0) {    //we are playing white
                if (board[5][5] === "w4") {      //we moved the RIGHT 4 for our first move
                    if (board[5][3] === "b3" || board[9][3] === "b3") {
                        return "E9, E5";            //move the LEFT 4 if opponent moved the RIGHT 3
                    } else {                    //otherwise move the RIGHT 2
                        return "H9, F9";
                    }
                } else if (board[4][5] === "w4") {                     //we moved the LEFT 4 for our first move
                    if (board[1][3] === "b3" || board[4][3] === "b3") {
                        return "F9, F5";            //move the RIGHT 4 if opponent moved the LEFT 3
                    } else {                    //otherwise move the LEFT 2
                        return "C9, E9";
                    }
                }
            } else {                            //we are playing black
                if (board[5][4] === "b4") {      //we moved the RIGHT 4 for our first move
                    if (board[5][6] === "w3" || board[9][6] === "w3") {
                        return "E0, E4";            //move the LEFT 4 if opponent moved the RIGHT 3
                    } else {                    //otherwise move the RIGHT 2
                        return "H0, F0";
                    }
                } else if (board[4][4] === "b4") {                     //we moved the LEFT 4 for our first move
                    if (board[1][6] === "w3" || board[4][6] === "w3") {
                        return "F0, F4";            //move the RIGHT 4 if opponent moved the LEFT 3
                    } else {                    //otherwise move the LEFT 2
                        return "C0, E0";
                    }
                }
            }
        case 3:
            if (getMyColor() === 0) {    //we are playing white
                if (board[5][9] === "w2") {      //we moved the RIGHT 2 for our second move
                    return "E9, E5";            //move the LEFT 4
                } else if (board[4][9] === "w2") { //we moved the LEFT 2 for our second move
                    return "F9, F5";            //move the RIGHT 4
                } else {
                    moves = new Array("H9, F9", "C9, E9");      //let's just move a random 2 and hope for the best =)
                    return moves[Math.floor(Math.random() * moves.length)];
                }
            } else {                            //we are playing black
                if (board[5][0] === "b2") {      //we moved the RIGHT 2 for our second move
                    return "E0, E4";            //move the LEFT 4
                } else if (board[4][0] === "b2") { //we moved the LEFT 2 for our second move
                    return "F0, F4";            //move the RIGHT 4
                } else {
                    moves = new Array("H0, F0", "C0, E0");      //let's just move a random 2 and hope for the best =)
                    return moves[Math.floor(Math.random() * moves.length)];
                }
            }
        case 4:
            if (getMyColor() === 0) {    //we are playing white
                if (board[5][9] === "w2") {      //we moved the RIGHT 2 already
                    return "C9, E9";            //move the LEFT 2
                } else {
                    return "H9, F9";            //move the RIGHT 2
                }
            } else {
                if (board[5][0] === "b2") {      //we moved the RIGHT 2 already
                    return "C0, E0";            //move the LEFT 2
                } else {
                    return "H0, F0";            //move the RIGHT 2
                }
            }
        default:
            if (isPlayerInCheck(getMyColor()) === TRUE) {        // Capture the opponent’s 1
                moves = new Array(NUM_PIECES_PER_SIDE);
                var movesAdded = 0;
                for (var i = 0; i < NUM_PIECES_PER_SIDE; i++) {
                    var location = pieceLocations[i];
                    if (location === "")
                        break;
                    var validMoves = getValidMoves(location, getMyColor(), null);
                    for (var j = 0; j < VALID_MOVES_ARRAY_LENGTH; j++) {
                        var move = validMoves[j];
                        if (move === "")
                            break;

                        moves[movesAdded] = location + ", " + move;
                        movesAdded++
                    }
                }
                if (movesAdded === 0) {                //if you have no legal moves, that means you are checkmated
                    return "CHECKMATED";
                }
                return moves[Math.floor(Math.random() * movesAdded)];
            } else {
                moves = new Array(NUM_PIECES_PER_SIDE);
                var movesAdded = 0;
                for (var i = 0; i < NUM_PIECES_PER_SIDE; i++) {
                    var location = pieceLocations[i];
                    if (location === "")
                        break;
                    /*if (piece === "w4" || piece === "b4")
                        continue;
                    if (piece === "w2" || piece === "b2")
                        continue;*/
                    var piece = getPieceMoveDistance(location);
                    if (piece === 4) {                   //do not move pieces that are part of the formation
                        continue;
                    }
                    if (piece === 2 && cellToRow(location) % 2 !== getMyColor()) {   //neat way to check which parity of 2s
                        continue;
                    }

                    var validMoves = getValidMoves(location, getMyColor());
                    for (var j = 0; j < VALID_MOVES_ARRAY_LENGTH; j++) {
                        var move = validMoves[j];
                        if (move === "")
                            break;

                        moves[movesAdded] = location + ", " + move;
                        movesAdded++;
                    }
                }
                if (movesAdded === 0) {                //if you have no legal moves, that means you are checkmated
                    return moves + "     " + pieceLocations + "     " + movesAdded + "  " + "CHECKMATED";
                }
                return moves[Math.floor(Math.random() * movesAdded)];
            }
    }
}`
export const helperFunctions = `// cell values are NEVER null - they should be "" if empty
var NUM_PIECES_PER_SIDE = 20; // int
var NUM_PAWNS_PER_SIDE = 9; // int
var BOARD_LENGTH = 10; // int
var MIN_MOVE_DISTANCE = 1; // int
var MAX_MOVE_DISTANCE = 4; // int
var WHITE_CHAR = 'w'; // char
var BLACK_CHAR = 'b'; // char
var VALID_MOVES_ARRAY_LENGTH = 81; // int
var TRUE = 1; // int
var FALSE = 0; // int
var WHITE = 0; // int
var BLACK = 1; // int
var NO_PIECE = -1; // int
var ERR_INVALID_COLOR = -2; // int
var ERR_INVALID_COL = -3; // int
var ERR_INVALID_ROW = -4; // int
var ERR_FORMAT = -5; // int
var ERR_FORMAT_MOVE_FROM = -6; // int
var ERR_FORMAT_MOVE_TO = -7; // int
var GameState = /** @class */ (function () {
    function GameState() {
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
    return GameState;
}());
/**
 * @return {string[][]} -           The String[][] representation of the game
 board, comprised of ‘cells’, as described
 at the top of this doc.
 */
function getBoard() {
    return gameState.board;
}
/**
 * @return {number}	-	  	 An integer representing the color of
 * 				 	 the current player.
 * 				 	 0 = WHITE  and  1 = BLACK
 */
function getMyColor() {
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
function getOpponentColor(myColor) {
    if (myColor === WHITE)
        return BLACK;
    else if (myColor === BLACK)
        return WHITE;
    else
        return ERR_INVALID_COLOR;
}
function getCellValue(arg1, arg2) {
    // getCellValue(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var foundVal = getCellValue(cellToCol(cell), cellToRow(cell));
        if (foundVal === null || foundVal.length != 2)
            return "";
        return foundVal;
    }
    // getCellValue(col, row)
    var col = arg1;
    var row = arg2;
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
function cellToCol(cell) {
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
function cellToRow(cell) {
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
function cellToColChar(cell) {
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
function cellToRowChar(cell) {
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
function colToColChar(col) {
    return String.fromCharCode(col + 'A'.charCodeAt(0));
}
/**
 * @param {number} row -   The index of the target row’s row in the
 * 				 String[][] board.
 *
 * @return {string} -      The row of the cell on the board, from
 *				 characters 0-9. See diagram at top of doc as a string of length 1.
 */
function rowToRowChar(row) {
    return ("" + row).charAt(0);
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
function colAndRowToCell(col, row) {
    return "" + colToColChar(col) + rowToRowChar(row);
}
function cellHasPiece(arg1, arg2) {
    // cellHasPiece(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass to overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // cellHasPiece(col, row)
    var col = arg1;
    var row = arg2;
    var isCellValidRet = isCellValid(col, row);
    if (isCellValidRet != TRUE)
        return isCellValidRet;
    return !(getCellValue(col, row) === "") ? TRUE : FALSE;
}
function isMyPiece(arg1, arg2, arg3) {
    // isMyPiece(cell, myColor, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass to overload
        arg3 = arg2;
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // isMyPiece(col, row, myColor)
    var col = arg1;
    var row = arg2;
    var myColor = arg3;
    var isCellValidRet = isCellValid(col, row);
    if (isCellValidRet != TRUE)
        return isCellValidRet;
    return getPieceColor(col, row) === myColor ? TRUE : FALSE;
}
function getPieceColor(arg1, arg2) {
    // getPieceColor(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass into overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // getPieceColor(col, row)
    var col = arg1;
    var row = arg2;
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
function getPieceMoveDistance(arg1, arg2) {
    // getPieceMoveDistance(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass into overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // getPieceMoveDistance(col, row)
    var col = arg1;
    var row = arg2;
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
function getMyPieceLocations(color) {
    var locations = new Array(NUM_PIECES_PER_SIDE);
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
function getValidMoves(arg1, arg2, arg3) {
    // getValidMoves(cell, myColor, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        // sets up args to pass into overload
        arg3 = arg2;
        arg2 = cellToRow(cell);
        arg1 = cellToCol(cell);
    }
    // getValidMoves(col, row, myColor);
    var col = arg1;
    var row = arg2;
    var myColor = arg3;
    var moves = new Array(VALID_MOVES_ARRAY_LENGTH);
    for (var i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {
        moves[i] = "";
    }
    var currentArrayIndex = 0;
    var moveDistance = getPieceMoveDistance(col, row);
    if (moveDistance <= 0)
        return moves;
    for (var i = -moveDistance; i <= moveDistance; i += moveDistance) { //William, you almost got it right. I just need to change two places in the code, i++ and j++
        for (var j = -moveDistance; j <= moveDistance; j += moveDistance) { //to i += moveDistance and j += moveDistance ! Plus corresponding code in SimulationApp
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
function isPlayerInCheck(color) {
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
function whichColumnIsPlayerInCheck(color) {
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
function isMoveValid(arg1, arg2, arg3) {
    // isMoveValid(moveString, myColor, unusedParam)
    if (typeof arg2 === 'number') {
        var moveString = arg1;
        var moveCells = moveString.split(", ");
        if (moveCells.length != 2)
            return ERR_FORMAT;
        // sets up args to pass into overload
        arg3 = arg2;
        arg1 = moveCells[0];
        arg2 = moveCells[1];
    }
    // isMoveValid(fromCell, toCell, myColor)
    var fromCell = arg1;
    var toCell = arg2;
    var myColor = arg3;
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
function isCellValid(arg1, arg2) {
    // isCellValid(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
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
    var col = arg1;
    var row = arg2;
    if (col < 0 || col > 9)
        return ERR_INVALID_COL;
    if (row < 0 || row > 9)
        return ERR_INVALID_ROW;
    return TRUE;
}
`
export const devComplete = `function getMove() {
    // This stores the String[][] that is the current state of the game board.
    // The board is 10x10, with each player having their 20 pieces lined up
    // on opposites sides from eachother.  
    // Each square tile on the board is called a cell.  Cells are named with
    // string values from "A0" to "J9".
    //
    // See board documentation for more.
    var board = gameState.board;

    // Gathers the names of all the cells that contain my pieces.
    // This is a fixed-length array whose elements hold "" when empty, never null.
    var pieceLocations = getMyPieceLocations(getMyColor());

    // Stores all the valid moves from every piece of mine into the moves Array
    //
    // Moves are stored in the string form "<fromCell>, <toCell>"
    //    Example - "B5, E2"
    var numMovesFound = 0;
    var moves = new Array(NUM_PIECES_PER_SIDE);

    // Iterate through every piece I have
    for (var i = 0; i < NUM_PIECES_PER_SIDE; i++) {
        var piece = pieceLocations[i];

        // Stop iterating if there are no more pieces
        if (piece === "")
            break;

        // Iterates through all valid moves that my pieces have, adding
        // each valid move to the moves Array.
        //
        // These valid moves are stored in a fixed-size Array whose
        // elements are never null, but instead are "" when empty.
        var validMoves = getValidMoves(piece, getMyColor(), null);
        for (var j = 0; j < VALID_MOVES_ARRAY_LENGTH; j++) {
            var move = validMoves[j];

            // Stop iterating if there are no more valid moves for this piece
            if (move === "")
                break;

            // Adds the current move to the moves Array
            moves[numMovesFound] = piece + ", " + move;
            numMovesFound++;
        }
    }

    //if you have no legal moves, that means you are checkmated
    if (numMovesFound === 0) {
        // Since you are about to lose, it is ok to return an invalid
        //    move string here, like "CHECKMATED"
        return "CHECKMATED";
    }

    // chooses a random move from the valid moves Array
    return moves[Math.floor((Math.random() * numMovesFound))];
}`
export const emptyStarter = `// cell values are NEVER null - they should be "" if empty
var NUM_PIECES_PER_SIDE = 20; // int
var NUM_PAWNS_PER_SIDE = 9; // int
var BOARD_LENGTH = 10; // int
var MIN_MOVE_DISTANCE = 1; // int
var MAX_MOVE_DISTANCE = 4; // int
var WHITE_CHAR = 'w'; // char
var BLACK_CHAR = 'b'; // char
var VALID_MOVES_ARRAY_LENGTH = 81; // int
var TRUE = 1; // int
var FALSE = 0; // int
var WHITE = 0; // int
var BLACK = 1; // int
var NO_PIECE = -1; // int
var ERR_INVALID_COLOR = -2; // int
var ERR_INVALID_COL = -3; // int
var ERR_INVALID_ROW = -4; // int
var ERR_FORMAT = -5; // int
var ERR_FORMAT_MOVE_FROM = -6; // int
var ERR_FORMAT_MOVE_TO = -7; // int
var GameState = /** @class */ (function () {
    function GameState() {
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
    return GameState;
}());
/**
 * @return {string[][]} -           The String[][] representation of the game
 board, comprised of ‘cells’, as described
 at the top of this doc.
 */
function getBoard() {
    return gameState.board;
}
/**
 * @return {number}	-	  	 An integer representing the color of
 * 				 	 the current player.
 * 				 	 0 = WHITE  and  1 = BLACK
 */
function getMyColor() {
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
function getOpponentColor(myColor) {
    if (myColor === WHITE)
        return BLACK;
    else if (myColor === BLACK)
        return WHITE;
    else
        return ERR_INVALID_COLOR;
}
function getCellValue(arg1, arg2) {
    // getCellValue(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var foundVal = getCellValue(cellToCol(cell), cellToRow(cell));
        if (foundVal === null || foundVal.length != 2)
            return "";
        return foundVal;
    }
    // getCellValue(col, row)
    var col = arg1;
    var row = arg2;
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
function cellToCol(cell) {
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
function cellToRow(cell) {
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
function cellToColChar(cell) {
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
function cellToRowChar(cell) {
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
function colToColChar(col) {
    return String.fromCharCode(col + 'A'.charCodeAt(0));
}
/**
 * @param {number} row -   The index of the target row’s row in the
 * 				 String[][] board.
 *
 * @return {string} -      The row of the cell on the board, from
 *				 characters 0-9. See diagram at top of doc as a string of length 1.
 */
function rowToRowChar(row) {
    return ("" + row).charAt(0);
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
function colAndRowToCell(col, row) {
    return "" + colToColChar(col) + rowToRowChar(row);
}
function cellHasPiece(arg1, arg2) {
    // cellHasPiece(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass to overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // cellHasPiece(col, row)
    var col = arg1;
    var row = arg2;
    var isCellValidRet = isCellValid(col, row);
    if (isCellValidRet != TRUE)
        return isCellValidRet;
    return !(getCellValue(col, row) === "") ? TRUE : FALSE;
}
function isMyPiece(arg1, arg2, arg3) {
    // isMyPiece(cell, myColor, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass to overload
        arg3 = arg2;
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // isMyPiece(col, row, myColor)
    var col = arg1;
    var row = arg2;
    var myColor = arg3;
    var isCellValidRet = isCellValid(col, row);
    if (isCellValidRet != TRUE)
        return isCellValidRet;
    return getPieceColor(col, row) === myColor ? TRUE : FALSE;
}
function getPieceColor(arg1, arg2) {
    // getPieceColor(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass into overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // getPieceColor(col, row)
    var col = arg1;
    var row = arg2;
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
function getPieceMoveDistance(arg1, arg2) {
    // getPieceMoveDistance(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        var isCellValidRet = isCellValid(cell, null);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        // sets up args to pass into overload
        arg1 = cellToCol(cell);
        arg2 = cellToRow(cell);
    }
    // getPieceMoveDistance(col, row)
    var col = arg1;
    var row = arg2;
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
function getMyPieceLocations(color) {
    var locations = new Array(NUM_PIECES_PER_SIDE);
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
function getValidMoves(arg1, arg2, arg3) {
    // getValidMoves(cell, myColor, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
        // sets up args to pass into overload
        arg3 = arg2;
        arg2 = cellToRow(cell);
        arg1 = cellToCol(cell);
    }
    // getValidMoves(col, row, myColor);
    var col = arg1;
    var row = arg2;
    var myColor = arg3;
    var moves = new Array(VALID_MOVES_ARRAY_LENGTH);
    for (var i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {
        moves[i] = "";
    }
    var currentArrayIndex = 0;
    var moveDistance = getPieceMoveDistance(col, row);
    if (moveDistance <= 0)
        return moves;
    for (var i = -moveDistance; i <= moveDistance; i += moveDistance) { //William, you almost got it right. I just need to change two places in the code, i++ and j++
        for (var j = -moveDistance; j <= moveDistance; j += moveDistance) { //to i += moveDistance and j += moveDistance ! Plus corresponding code in SimulationApp
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
function isPlayerInCheck(color) {
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
function whichColumnIsPlayerInCheck(color) {
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
function isMoveValid(arg1, arg2, arg3) {
    // isMoveValid(moveString, myColor, unusedParam)
    if (typeof arg2 === 'number') {
        var moveString = arg1;
        var moveCells = moveString.split(", ");
        if (moveCells.length != 2)
            return ERR_FORMAT;
        // sets up args to pass into overload
        arg3 = arg2;
        arg1 = moveCells[0];
        arg2 = moveCells[1];
    }
    // isMoveValid(fromCell, toCell, myColor)
    var fromCell = arg1;
    var toCell = arg2;
    var myColor = arg3;
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
function isCellValid(arg1, arg2) {
    // isCellValid(cell, unusedParam)
    if (typeof arg1 === 'string') {
        var cell = arg1;
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
    var col = arg1;
    var row = arg2;
    if (col < 0 || col > 9)
        return ERR_INVALID_COL;
    if (row < 0 || row > 9)
        return ERR_INVALID_ROW;
    return TRUE;
}

/**
 * Returns all legal moves that capture (not trade) a 1-piece
 * @return all legal moves that capture (not trade) a 1-piece (and how many)
 */
function getAllLegalCapture1PieceMoves() {
    var board = gameState.board;
    var pieceLocations = getMyPieceLocations(getMyColor());
    var numMovesFound = 0;
    var moves = new Array(NUM_PIECES_PER_SIDE);
    for (var i = 0; i < NUM_PIECES_PER_SIDE; i++) {
        var piece = pieceLocations[i];
        if (piece === "")
            break;
        var validMoves = getValidMoves(piece, getMyColor(), null);
        for (var j = 0; j < VALID_MOVES_ARRAY_LENGTH; j++) {
            var move = validMoves[j];
            if (move === "") 
                break;

            if (getPieceMoveDistance(move, board) == 1 
                    && getPieceMoveDistance(piece, board) > getPieceMoveDistance(move, board)) {    
              moves[numMovesFound] = piece + ", " + move;
              numMovesFound++;
            }
        }
    }
    return [moves, numMovesFound];
}

/**
 * Returns all legal moves that capture (not trade) a piece
 * @return all legal moves that capture (not trade) a piece (and how many)
 */
function getAllLegalCaptureMoves() {
    var board = gameState.board;
    var pieceLocations = getMyPieceLocations(getMyColor());
    var numMovesFound = 0;
    var moves = new Array(NUM_PIECES_PER_SIDE);
    for (var i = 0; i < NUM_PIECES_PER_SIDE; i++) {
        var piece = pieceLocations[i];
        if (piece === "")
            break;
        var validMoves = getValidMoves(piece, getMyColor(), null);
        for (var j = 0; j < VALID_MOVES_ARRAY_LENGTH; j++) {
            var move = validMoves[j];
            if (move === "") 
                break;

            if (getPieceMoveDistance(move, board) != 0 
                    && getPieceMoveDistance(piece, board) > getPieceMoveDistance(move, board)) {    
              moves[numMovesFound] = piece + ", " + move;
              numMovesFound++;
            }
        }
    }
    return [moves, numMovesFound];
}

/**
 * Returns all legal moves
 * @return all legal moves (and how many)
 */
function getAllLegalMoves() {
    var board = gameState.board;
    var pieceLocations = getMyPieceLocations(getMyColor());
    var numMovesFound = 0;
    var moves = new Array(NUM_PIECES_PER_SIDE);
    for (var i = 0; i < NUM_PIECES_PER_SIDE; i++) {
        var piece = pieceLocations[i];
        if (piece === "")
            break;
        var validMoves = getValidMoves(piece, getMyColor(), null);
        for (var j = 0; j < VALID_MOVES_ARRAY_LENGTH; j++) {
            var move = validMoves[j];
            if (move === "")
                break;
            moves[numMovesFound] = piece + ", " + move;
            numMovesFound++;
        }
    }
    return [moves, numMovesFound];
}

/**
 * Returns a legal random move given the current game state (i.e. must escape check).
 *
 * If no legal move exists, returns "CHECKMATED" to indicate one has lost
 * @return a random move
 */
function getRandomMove() {
    var arr = getAllLegalMoves();
    var moves = arr[0];
    var numMovesFound = arr[1];

    if (numMovesFound === 0) { //if you have no legal moves, that means you are checkmated
        return "CHECKMATED";
    }
    return moves[Math.floor((Math.random() * numMovesFound))];
}

function getMove() {
  /* HINT: check how many (if any) of a certain type of move exists
   */

  if (false /* insert your choice of condition */) {
      /* insert your choice of return move */
  }
  if (false /* insert your choice of return move */) {
      /* insert your choice of return move */
  }

  return getRandomMove();
}`
export const hardAi = { id: '-3', name: 'Hard Ai', gameId: 1, sourceCode: ` HardAI.prototype.tryThisMove$java_lang_String_A_A$java_lang_String = function (original, moveString) {
    var board = (function (dims) { var allocate = function (dims) { if (dims.length === 0) {
        return null;
    }
    else {
        var array = [];
        for (var i = 0; i < dims[0]; i++) {
            array.push(allocate(dims.slice(1)));
        }
        return array;
    } }; return allocate(dims); })([this.api.BOARD_LENGTH, this.api.BOARD_LENGTH]);
    for (var i = 0; i < this.api.BOARD_LENGTH; i++) {
        {
            for (var j = 0; j < this.api.BOARD_LENGTH; j++) {
                {
                    board[i][j] = original[i][j];
                }
                ;
            }
        }
        ;
    }
    var moveCells = moveString.split(", ");
    var fromCell = moveCells[0];
    var toCell = moveCells[1];
    var fromMoveDistance = this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(fromCell, board);
    var toMoveDistance = this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(toCell, board);
    var fromCol = this.api.cellToCol(fromCell);
    var fromRow = this.api.cellToRow(fromCell);
    var toCol = this.api.cellToCol(toCell);
    var toRow = this.api.cellToRow(toCell);
    var fromPiece = board[fromCol][fromRow];
    var toPiece = board[toCol][toRow];
    if (fromMoveDistance > toMoveDistance) {
        board[toCol][toRow] = board[fromCol][fromRow];
    }
    else if (fromMoveDistance === toMoveDistance) {
        board[toCol][toRow] = "";
    }
    else {
    }
    board[fromCol][fromRow] = "";
    return board;
};
HardAI.prototype.evaluatePosition = function (board, playerToMove) {
    var evaluation = 5 - 10 * playerToMove;
    var numWhite1s = 0;
    var numWhiteLF2s = 0;
    var numWhiteRF2s = 0;
    var numWhiteB2s = 0;
    var numWhite3s = 0;
    var pieceLocations = this.api.getMyPieceLocations(this.api.WHITE, board);
    for (var index7586 = 0; index7586 < pieceLocations.length; index7586++) {
        var piece = pieceLocations[index7586];
        {
            if (piece === (""))
                break;
            var moveDistance = this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board);
            if (moveDistance === 1) {
                evaluation += this.positionalValueOfWhite1s[this.api.cellToRow(piece)][this.api.cellToCol(piece)];
                numWhite1s++;
            }
            else if (moveDistance === 2) {
                evaluation += this.positionalValueOfWhite2s[this.api.cellToRow(piece)][this.api.cellToCol(piece)];
                if (this.api.cellToRow(piece) % 2 !== this.api.WHITE) {
                    numWhiteB2s++;
                }
                else if (this.api.cellToCol(piece) % 2 === this.api.WHITE) {
                    numWhiteLF2s++;
                }
                else {
                    numWhiteRF2s++;
                }
            }
            else if (moveDistance === 3) {
                evaluation += this.positionalValueOfWhite3s[this.api.cellToRow(piece)][this.api.cellToCol(piece)];
                numWhite3s++;
            }
            else {
                evaluation += this.positionalValueOfWhite4s[this.api.cellToRow(piece)][this.api.cellToCol(piece)];
            }
        }
    }
    evaluation += this.pieceValueOfWhite1s[numWhite1s];
    evaluation += this.pieceValueOfWhiteB2s[numWhiteB2s];
    evaluation += this.pieceValueOfWhiteLF2s[numWhiteLF2s];
    evaluation += this.pieceValueOfWhiteRF2s[numWhiteRF2s];
    evaluation += this.pieceValueOfWhite3s[numWhite3s];
    if (numWhiteB2s >= 2 && numWhiteLF2s >= 1 && numWhiteRF2s >= 1) {
        evaluation += this.allFourWhite2sBonus;
    }
    var numBlack1s = 0;
    var numBlackLF2s = 0;
    var numBlackRF2s = 0;
    var numBlackB2s = 0;
    var numBlack3s = 0;
    pieceLocations = this.api.getMyPieceLocations(this.api.BLACK, board);
    for (var index7587 = 0; index7587 < pieceLocations.length; index7587++) {
        var piece = pieceLocations[index7587];
        {
            if (piece === (""))
                break;
            var moveDistance = this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board);
            if (moveDistance === 1) {
                evaluation += this.positionalValueOfBlack1s[this.api.cellToRow(piece)][this.api.cellToCol(piece)];
                numBlack1s++;
            }
            else if (moveDistance === 2) {
                evaluation += this.positionalValueOfBlack2s[this.api.cellToRow(piece)][this.api.cellToCol(piece)];
                if (this.api.cellToRow(piece) % 2 !== this.api.BLACK) {
                    numBlackB2s++;
                }
                else if (this.api.cellToCol(piece) % 2 === this.api.BLACK) {
                    numBlackLF2s++;
                }
                else {
                    numBlackRF2s++;
                }
            }
            else if (moveDistance === 3) {
                evaluation += this.positionalValueOfBlack3s[this.api.cellToRow(piece)][this.api.cellToCol(piece)];
                numBlack3s++;
            }
            else {
                evaluation += this.positionalValueOfBlack4s[this.api.cellToRow(piece)][this.api.cellToCol(piece)];
            }
        }
    }
    evaluation += this.pieceValueOfBlack1s[numBlack1s];
    evaluation += this.pieceValueOfBlackB2s[numBlackB2s];
    evaluation += this.pieceValueOfBlackLF2s[numBlackLF2s];
    evaluation += this.pieceValueOfBlackRF2s[numBlackRF2s];
    evaluation += this.pieceValueOfBlack3s[numBlack3s];
    if (numBlackB2s >= 2 && numBlackLF2s >= 1 && numBlackRF2s >= 1) {
        evaluation += this.allFourBlack2sBonus;
    }
    return evaluation;
};
return HardAI;
}());`}
export const mediumAi = { id: '-2', name: 'Medium Ai', gameId: 1, sourceCode: `  MediumAI.prototype.tryThisMove = function (gameState, moveString) {
    var original = this.api.getBoard(gameState);
    var board = (function (dims) { var allocate = function (dims) { if (dims.length === 0) {
        return null;
    }
    else {
        var array = [];
        for (var i = 0; i < dims[0]; i++) {
            array.push(allocate(dims.slice(1)));
        }
        return array;
    } }; return allocate(dims); })([this.api.BOARD_LENGTH, this.api.BOARD_LENGTH]);
    for (var i = 0; i < this.api.BOARD_LENGTH; i++) {
        {
            for (var j = 0; j < this.api.BOARD_LENGTH; j++) {
                {
                    board[i][j] = original[i][j];
                }
                ;
            }
        }
        ;
    }
    var moveCells = moveString.split(", ");
    var fromCell = moveCells[0];
    var toCell = moveCells[1];
    var fromMoveDistance = this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(fromCell, board);
    var toMoveDistance = this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(toCell, board);
    var fromCol = this.api.cellToCol(fromCell);
    var fromRow = this.api.cellToRow(fromCell);
    var toCol = this.api.cellToCol(toCell);
    var toRow = this.api.cellToRow(toCell);
    var fromPiece = board[fromCol][fromRow];
    var toPiece = board[toCol][toRow];
    if (fromMoveDistance > toMoveDistance) {
        board[toCol][toRow] = board[fromCol][fromRow];
    }
    else if (fromMoveDistance === toMoveDistance) {
        board[toCol][toRow] = "";
    }
    else {
        return null;
    }
    board[fromCol][fromRow] = "";
    return board;
};` }