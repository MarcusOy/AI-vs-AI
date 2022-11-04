/* Generated from Java with JSweet 3.0.0 - http://www.jsweet.org */
var GameState = /** @class */ (function () {
    function GameState() {
        this.WHITE = 0;
        this.BLACK = 1;
        if (this.currentPlayer === undefined) {
            this.currentPlayer = 0;
        }
        this.numWhitePieces = 20;
        this.numBlackPieces = 20;
        this.numWhitePawns = 9;
        this.numBlackPawns = 9;
        this.numMovesMade = 0;
        this.board = [["b1", "b1", "", "", "", "", "", "", "w1", "w3"], ["b3", "b2", "", "", "", "", "", "", "w2", "w3"], ["b2", "b2", "", "", "", "", "", "", "w2", "w2"], ["b1", "b1", "", "", "", "", "", "", "w1", "w1"], ["b4", "b1", "", "", "", "", "", "", "w1", "w4"], ["b4", "b1", "", "", "", "", "", "", "w1", "w4"], ["b1", "b1", "", "", "", "", "", "", "w1", "w1"], ["b2", "b2", "", "", "", "", "", "", "w2", "w2"], ["b3", "b2", "", "", "", "", "", "", "w2", "w3"], ["b3", "b1", "", "", "", "", "", "", "w1", "w1"]];
    }
    GameState.prototype.getOpponent = function () {
        return (this.currentPlayer + 1) % 2;
    };
    /**
     *
     * @return {string}
     */
    GameState.prototype.toString = function () {
        return "GameState{WHITE=" + this.WHITE + ", BLACK=" + this.BLACK + ", currentPlayer=" + this.currentPlayer + ", numWhitePieces=" + this.numWhitePieces + ", numWhitePawns=" + this.numWhitePawns + ", numBlackPieces=" + this.numBlackPieces + ", numBlackPawns=" + this.numBlackPawns + ", numMovesMade=" + this.numMovesMade + '}';
    };
    return GameState;
}());
GameState["__class"] = "GameState";
var API = /** @class */ (function () {
    function API() {
        this.NUM_PIECES_PER_SIDE = 20;
        this.NUM_PAWNS_PER_SIDE = 9;
        this.BOARD_LENGTH = 10;
        this.MIN_MOVE_DISTANCE = 1;
        this.MAX_MOVE_DISTANCE = 4;
        this.WHITE_CHAR = 'w';
        this.BLACK_CHAR = 'b';
        this.VALID_MOVES_ARRAY_LENGTH = 81;
        this.TRUE = 1;
        this.FALSE = 0;
        this.WHITE = 0;
        this.BLACK = 1;
        this.NO_PIECE = -1;
        this.ERR_INVALID_COLOR = -2;
        this.ERR_INVALID_COL = -3;
        this.ERR_INVALID_ROW = -4;
        this.ERR_FORMAT = -5;
        this.ERR_FORMAT_MOVE_FROM = -6;
        this.ERR_FORMAT_MOVE_TO = -7;
    }
    /**
     * @param  {GameState} gameState  The GameState object sent from the
     * simulation service every time.  This stores
     * all the information about the current state
     * of the game, including a field that stores
     * the String[][] board.
     *
     * @return            {java.lang.String[][]} The String[][] representation of the game
     * board, comprised of 'cells', as described
     * at the top of this doc.
     */
    API.prototype.getBoard = function (gameState) {
        return gameState.board;
    };
    /**
     * @param  {GameState} gameState  The GameState object sent from the
     * simulation service every time.  This
     * stores all the information about the
     * current state
     * of the game, including which color
     * the current player is.
     *
     * @return		  	 {number} An integer representing the color of
     * the current player.
     * 0 = WHITE  and  1 = BLACK
     */
    API.prototype.getMyColor = function (gameState) {
        return gameState.currentPlayer;
    };
    /**
     * @return		  	 {number} An integer representing the color of
     * the not current player.
     * 0 = WHITE  and  1 = BLACK
     * Returns a negative integer, ERR_INVALID_COLOR,
     * if myColor is invalid
     * @param {number} myColor
     */
    API.prototype.getOpponentColor = function (myColor) {
        if (myColor === this.WHITE)
            return this.BLACK;
        else if (myColor === this.BLACK)
            return this.WHITE;
        else
            return this.ERR_INVALID_COLOR;
    };
    API.prototype.getCellValue$java_lang_String$java_lang_String_A_A = function (cell, board) {
        var foundVal = this.getCellValue$int$int$java_lang_String_A_A(this.cellToCol(cell), this.cellToRow(cell), board);
        if (foundVal == null || foundVal.length !== 2)
            return "";
        return foundVal;
    };
    API.prototype.getCellValue$int$int$java_lang_String_A_A = function (col, row, board) {
        return board[col][row];
    };
    /**
     * @param  {number} col    The index of the target cell's column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell's row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of 'cells', as described
     * at the top of this doc.
     * @return        {string} The two-character representation of a 'cell',
     * with '' being an empty cell with no piece, and
     * 'b1' representing one the black-side player's
     * 1 pieces.
     */
    API.prototype.getCellValue = function (col, row, board) {
        if (((typeof col === 'number') || col === null) && ((typeof row === 'number') || row === null) && ((board != null && board instanceof Array && (board.length == 0 || board[0] == null || board[0] instanceof Array)) || board === null)) {
            return this.getCellValue$int$int$java_lang_String_A_A(col, row, board);
        }
        else if (((typeof col === 'string') || col === null) && ((row != null && row instanceof Array && (row.length == 0 || row[0] == null || row[0] instanceof Array)) || row === null) && board === undefined) {
            return this.getCellValue$java_lang_String$java_lang_String_A_A(col, row);
        }
        else
            throw new Error('invalid overload');
    };
    /**
     * @param  {string} cell   The position of the cell on the board, from values 'A0' to 'J9'.
     *
     * @return        {number} The index of the target cell's column in the
     * String[][] board.
     * Returns a negative integer if an error occurs.
     *
     * Returns ERR_INVALID_COL if cell's column
     * is a character outside of the range A-J.
     * Returns ERR_INVALID_ROW if cell's row
     * is a character outside of the range 0-9.
     * Returns ERR_FORMAT if the cell is
     * otherwise improperly formatted.
     */
    API.prototype.cellToCol = function (cell) {
        var isCellValidRet = this.isCellValid$java_lang_String(cell);
        if (isCellValidRet !== this.TRUE)
            return isCellValidRet;
        return (function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(this.cellToColChar(cell)) - 'A'.charCodeAt(0);
    };
    /**
     * @param  {string} cell   The position of the cell on the board, from
     * values 'A0' to 'J9'.
     * @return        {number} The index of the target cell's row in the
     * String[][] board.
     * Returns a negative integer if an error occurs.
     *
     * Returns ERR_INVALID_COL if cell's column
     * is a character outside of the range A-J.
     * Returns ERR_INVALID_ROW if cell's row
     * is a character outside of the range 0-9.
     * Returns ERR_FORMAT if the cell is
     * otherwise improperly formatted.
     */
    API.prototype.cellToRow = function (cell) {
        var isCellValidRet = this.isCellValid$java_lang_String(cell);
        if (isCellValidRet !== this.TRUE)
            return isCellValidRet;
        return /* parseInt */ parseInt(cell.substring(1));
    };
    /**
     *
     * @param  {string} cell  The position of the cell on the board, from
     * values "A0" to "J9".
     *
     * @return       {string} The column of the cell on the board, from
     * characters A-J.
     *
     * See Board documention
     */
    API.prototype.cellToColChar = function (cell) {
        return cell.charAt(0);
    };
    /**
     *
     * @param  {string} cell  The position of the cell on the board, from
     * values "A0" to "J9".
     * @return       {string} The row of the cell on the board, from
     * characters A-J.
     *
     * See Board documention
     */
    API.prototype.cellToRowChar = function (cell) {
        return cell.charAt(1);
    };
    /**
     * @param  {number} col    The index of the target col's row in the
     * String[][] board.
     *
     * @return        {string} The column of the cell on the board, from
     * characters A-J. See diagram at top of doc.
     */
    API.prototype.colToColChar = function (col) {
        return String.fromCharCode((col + 'A'.charCodeAt(0)));
    };
    /**
     * @param  {number} row    The index of the target row's row in the
     * String[][] board.
     *
     * @return        {string} The row of the cell on the board, from
     * characters 0-9. See diagram at top of doc.
     */
    API.prototype.rowToRowChar = function (row) {
        return /* toString */ ('' + (row)).charAt(0);
    };
    /**
     * @param  {number} col    The index of the target cell's column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell's row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @return        {string} The two-character position of the cell on the
     * board, from values 'A0' to 'J9', that
     * corresponds to the passed row and column
     * indices.
     * For example, colAndRowToCell(2, 4) returns 'C4'
     */
    API.prototype.colAndRowToCell = function (col, row) {
        return "" + this.colToColChar(col) + this.rowToRowChar(row);
    };
    API.prototype.cellHasPiece$java_lang_String$java_lang_String_A_A = function (cell, board) {
        var isCellValidRet = this.isCellValid$java_lang_String(cell);
        if (isCellValidRet !== this.TRUE)
            return isCellValidRet;
        var col = this.cellToCol(cell);
        var row = this.cellToRow(cell);
        return this.cellHasPiece$int$int$java_lang_String_A_A(col, row, board);
    };
    API.prototype.cellHasPiece$int$int$java_lang_String_A_A = function (col, row, board) {
        var isCellValidRet = this.isCellValid$int$int(col, row);
        if (isCellValidRet !== this.TRUE)
            return isCellValidRet;
        return !(this.getCellValue$int$int$java_lang_String_A_A(col, row, board) === ("")) ? this.TRUE : this.FALSE;
    };
    /**
     * @param  {number} col    The index of the target cell's column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell's row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of 'cells', as described
     * at the top of this doc.
     *
     * @return        {number} Returns TRUE if the given cell is storing a
     * string representing a piece, like 'b3' or 'w1'.
     * False if the cell is storing ''.
     * Returns a negative integer if an error
     * occurs.
     *
     * Returns ERR_INVALID_COL if the passed cell's
     * column is an invalid character.
     * Returns ERR_INVALID_ROW if the passed cell's
     * row is an invalid character.
     * Returns ERR_FORMAT if the passed cell is
     * otherwise improperly formatted.
     */
    API.prototype.cellHasPiece = function (col, row, board) {
        if (((typeof col === 'number') || col === null) && ((typeof row === 'number') || row === null) && ((board != null && board instanceof Array && (board.length == 0 || board[0] == null || board[0] instanceof Array)) || board === null)) {
            return this.cellHasPiece$int$int$java_lang_String_A_A(col, row, board);
        }
        else if (((typeof col === 'string') || col === null) && ((row != null && row instanceof Array && (row.length == 0 || row[0] == null || row[0] instanceof Array)) || row === null) && board === undefined) {
            return this.cellHasPiece$java_lang_String$java_lang_String_A_A(col, row);
        }
        else
            throw new Error('invalid overload');
    };
    API.prototype.isMyPiece$java_lang_String$int$java_lang_String_A_A = function (cell, myColor, board) {
        var isCellValidRet = this.isCellValid$java_lang_String(cell);
        if (isCellValidRet !== this.TRUE)
            return isCellValidRet;
        var col = this.cellToCol(cell);
        var row = this.cellToRow(cell);
        return this.isMyPiece$int$int$int$java_lang_String_A_A(col, row, myColor, board);
    };
    API.prototype.isMyPiece$int$int$int$java_lang_String_A_A = function (col, row, myColor, board) {
        var isCellValidRet = this.isCellValid$int$int(col, row);
        if (isCellValidRet !== this.TRUE)
            return isCellValidRet;
        return this.getPieceColor$int$int$java_lang_String_A_A(col, row, board) === myColor ? this.TRUE : this.FALSE;
    };
    /**
     * @param  {number} col    The index of the target cell's column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell's row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of 'cells', as described
     * at the top of this doc.
     * @param  {number} myColor  The integer representing your color WHITE=0, BLACK=1
     * @return        {number} Returns TRUE if the given cell is storing a
     * string representing a piece of yours.  I.e.
     * 'b3' if you are on black-side.
     * Returns FALSE if the above condition isn't met.
     * Returns a negative integer if an error
     * occurs.
     * Returns ERR_INVALID_COL if the passed cell's
     * column is an invalid character.
     * Returns ERR_INVALID_ROW if the passed cell's
     * row is an invalid character.
     * Returns ERR_FORMAT if the passed cell is
     * otherwise improperly formatted.
     */
    API.prototype.isMyPiece = function (col, row, myColor, board) {
        if (((typeof col === 'number') || col === null) && ((typeof row === 'number') || row === null) && ((typeof myColor === 'number') || myColor === null) && ((board != null && board instanceof Array && (board.length == 0 || board[0] == null || board[0] instanceof Array)) || board === null)) {
            return this.isMyPiece$int$int$int$java_lang_String_A_A(col, row, myColor, board);
        }
        else if (((typeof col === 'string') || col === null) && ((typeof row === 'number') || row === null) && ((myColor != null && myColor instanceof Array && (myColor.length == 0 || myColor[0] == null || myColor[0] instanceof Array)) || myColor === null) && board === undefined) {
            return this.isMyPiece$java_lang_String$int$java_lang_String_A_A(col, row, myColor);
        }
        else
            throw new Error('invalid overload');
    };
    API.prototype.getPieceColor$java_lang_String$java_lang_String_A_A = function (cell, board) {
        var isCellValidRet = this.isCellValid$java_lang_String(cell);
        if (isCellValidRet !== this.TRUE)
            return isCellValidRet;
        return this.getPieceColor$int$int$java_lang_String_A_A(this.cellToCol(cell), this.cellToRow(cell), board);
    };
    API.prototype.getPieceColor$int$int$java_lang_String_A_A = function (col, row, board) {
        var isCellValidRet = this.isCellValid$int$int(col, row);
        if (isCellValidRet !== this.TRUE)
            return isCellValidRet;
        if (this.cellHasPiece$int$int$java_lang_String_A_A(col, row, board) === this.FALSE)
            return this.NO_PIECE;
        var cellVal = this.getCellValue$int$int$java_lang_String_A_A(col, row, board);
        var colorChar = cellVal.charAt(0);
        if ((function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(colorChar) == (function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(this.WHITE_CHAR)) {
            return this.WHITE;
        }
        else if ((function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(colorChar) == (function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(this.BLACK_CHAR)) {
            return this.BLACK;
        }
        else {
            return this.NO_PIECE;
        }
    };
    /**
     * @param  {number} col    The index of the target cell's column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell's row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of 'cells', as described
     * at the top of this doc.
     * @return        {number} An integer representing the color/owner of the
     * piece.  0 = WHITE, 1 = BLACK, and -1 = NO_PIECE
     * Returns a negative integer if an error
     * occurs.
     * Returns ERR_INVALID_COL if the passed cell's
     * column is an invalid character.
     * Returns ERR_INVALID_ROW if the passed cell's
     * row is an invalid character.
     * Returns ERR_FORMAT if the passed cell is
     * otherwise improperly formatted.
     */
    API.prototype.getPieceColor = function (col, row, board) {
        if (((typeof col === 'number') || col === null) && ((typeof row === 'number') || row === null) && ((board != null && board instanceof Array && (board.length == 0 || board[0] == null || board[0] instanceof Array)) || board === null)) {
            return this.getPieceColor$int$int$java_lang_String_A_A(col, row, board);
        }
        else if (((typeof col === 'string') || col === null) && ((row != null && row instanceof Array && (row.length == 0 || row[0] == null || row[0] instanceof Array)) || row === null) && board === undefined) {
            return this.getPieceColor$java_lang_String$java_lang_String_A_A(col, row);
        }
        else
            throw new Error('invalid overload');
    };
    API.prototype.getPieceMoveDistance$java_lang_String$java_lang_String_A_A = function (cell, board) {
        var isCellValidRet = this.isCellValid$java_lang_String(cell);
        if (isCellValidRet !== this.TRUE)
            return isCellValidRet;
        var col = this.cellToCol(cell);
        var row = this.cellToRow(cell);
        return this.getPieceMoveDistance$int$int$java_lang_String_A_A(col, row, board);
    };
    API.prototype.getPieceMoveDistance$int$int$java_lang_String_A_A = function (col, row, board) {
        var isCellValidRet = this.isCellValid$int$int(col, row);
        if (isCellValidRet !== this.TRUE)
            return isCellValidRet;
        if (this.cellHasPiece$int$int$java_lang_String_A_A(col, row, board) === this.FALSE)
            return 0;
        var cellVal = this.getCellValue$int$int$java_lang_String_A_A(col, row, board);
        return /* parseInt */ parseInt(cellVal.substring(1));
    };
    /**
     * @param  {number} col    The index of the target cell's column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell's row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of 'cells', as described
     * at the top of this doc.
     * @return        {number} An integer representing the color/owner of the
     * piece.  0 = WHITE, 1 = BLACK, and -1 = NO_PIECE
     * Returns a negative integer if an error
     * occurs.
     * Returns ERR_INVALID_COL if the passed cell's
     * column is an invalid character.
     * Returns ERR_INVALID_ROW if the passed cell's
     * row is an invalid character.
     * Returns ERR_FORMAT if the passed cell is
     * otherwise improperly formatted.
     */
    API.prototype.getPieceMoveDistance = function (col, row, board) {
        if (((typeof col === 'number') || col === null) && ((typeof row === 'number') || row === null) && ((board != null && board instanceof Array && (board.length == 0 || board[0] == null || board[0] instanceof Array)) || board === null)) {
            return this.getPieceMoveDistance$int$int$java_lang_String_A_A(col, row, board);
        }
        else if (((typeof col === 'string') || col === null) && ((row != null && row instanceof Array && (row.length == 0 || row[0] == null || row[0] instanceof Array)) || row === null) && board === undefined) {
            return this.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(col, row);
        }
        else
            throw new Error('invalid overload');
    };
    /**
     *
     * @param {number} color  An integer representing the color of
     * the current player.
     * @param {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of 'cells', as described
     * at the top of this doc.
     * @return		 {java.lang.String[]} An array of cells that pieces of the specified
     * color are in.  The array is of fixed length 20,
     * with empty array entries having the value "".
     */
    API.prototype.getMyPieceLocations = function (color, board) {
        var locations = (function (s) { var a = []; while (s-- > 0)
            a.push(null); return a; })(this.NUM_PIECES_PER_SIDE);
        for (var i = 0; i < this.NUM_PIECES_PER_SIDE; i++) {
            locations[i] = "";
        }
        var curArrIndex = 0;
        for (var i = 0; i < this.BOARD_LENGTH; i++) {
            {
                for (var j = 0; j < this.BOARD_LENGTH; j++) {
                    {
                        if (this.isMyPiece$int$int$int$java_lang_String_A_A(i, j, color, board) === this.TRUE) {
                            locations[curArrIndex] = this.colAndRowToCell(i, j);
                            curArrIndex++;
                        }
                    }
                    ;
                }
            }
            ;
        }
        return locations;
    };
    API.prototype.getValidMoves$java_lang_String$int$java_lang_String_A_A = function (cell, myColor, board) {
        var row = this.cellToRow(cell);
        var col = this.cellToCol(cell);
        return this.getValidMoves$int$int$int$java_lang_String_A_A(col, row, myColor, board);
    };
    API.prototype.getValidMoves$int$int$int$java_lang_String_A_A = function (col, row, myColor, board) {
        var moves = (function (s) { var a = []; while (s-- > 0)
            a.push(null); return a; })(this.VALID_MOVES_ARRAY_LENGTH);
        for (var i = 0; i < this.VALID_MOVES_ARRAY_LENGTH; i++) {
            {
                moves[i] = "";
            }
            ;
        }
        var currentArrayIndex = 0;
        var moveDistance = this.getPieceMoveDistance$int$int$java_lang_String_A_A(col, row, board);
        if (moveDistance <= 0)
            return moves;
        for (var i = -moveDistance; i <= moveDistance; i += moveDistance) {
            {
                for (var j = -moveDistance; j <= moveDistance; j += moveDistance) {
                    {
                        var newCol = col + i;
                        var newRow = row + j;
                        if ((this.isCellValid$int$int(newCol, newRow) === this.TRUE) && this.isMyPiece$int$int$int$java_lang_String_A_A(newCol, newRow, myColor, board) !== this.TRUE) {
                            var pieceColor = this.getPieceColor$int$int$java_lang_String_A_A(col, row, board);
                            if (this.isPlayerInCheck(pieceColor, board) === this.TRUE) {
                                var columnInCheck = this.whichColumnIsPlayerInCheck(pieceColor, board);
                                var rowToCheck = (pieceColor === this.WHITE) ? 9 : 0;
                                if (newCol !== columnInCheck || newRow !== rowToCheck)
                                    continue;
                            }
                            moves[currentArrayIndex] = this.colAndRowToCell(newCol, newRow);
                            currentArrayIndex++;
                        }
                    }
                    ;
                }
            }
            ;
        }
        return moves;
    };
    /**
     * @param  {number} col    The index of the target cell's column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell's row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {number} myColor  The integer representing your color WHITE=0, BLACK=1
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of 'cells', as described
     * at the top of this doc.
     * @return        {java.lang.String[]} An array of all cell positions that the piece
     * in the current cell can move to, represented
     * like ['E7', 'G7', 'E6', 'H8'].  If the owner of
     */
    API.prototype.getValidMoves = function (col, row, myColor, board) {
        if (((typeof col === 'number') || col === null) && ((typeof row === 'number') || row === null) && ((typeof myColor === 'number') || myColor === null) && ((board != null && board instanceof Array && (board.length == 0 || board[0] == null || board[0] instanceof Array)) || board === null)) {
            return this.getValidMoves$int$int$int$java_lang_String_A_A(col, row, myColor, board);
        }
        else if (((typeof col === 'string') || col === null) && ((typeof row === 'number') || row === null) && ((myColor != null && myColor instanceof Array && (myColor.length == 0 || myColor[0] == null || myColor[0] instanceof Array)) || myColor === null) && board === undefined) {
            return this.getValidMoves$java_lang_String$int$java_lang_String_A_A(col, row, myColor);
        }
        else
            throw new Error('invalid overload');
    };
    API.prototype.getValidMovesCheckMateIncluded = function (cell, myColor, board) {
        var row = this.cellToRow(cell);
        var col = this.cellToCol(cell);
        var moves = (function (s) { var a = []; while (s-- > 0)
            a.push(null); return a; })(this.VALID_MOVES_ARRAY_LENGTH);
        for (var i = 0; i < this.VALID_MOVES_ARRAY_LENGTH; i++) {
            {
                moves[i] = "";
            }
            ;
        }
        var currentArrayIndex = 0;
        var moveDistance = this.getPieceMoveDistance$int$int$java_lang_String_A_A(col, row, board);
        if (moveDistance <= 0)
            return moves;
        for (var i = -moveDistance; i <= moveDistance; i += moveDistance) {
            {
                for (var j = -moveDistance; j <= moveDistance; j += moveDistance) {
                    {
                        var newCol = col + i;
                        var newRow = row + j;
                        if ((this.isCellValid$int$int(newCol, newRow) === this.TRUE) && this.isMyPiece$int$int$int$java_lang_String_A_A(newCol, newRow, myColor, board) !== this.TRUE) {
                            var pieceColor = this.getPieceColor$int$int$java_lang_String_A_A(col, row, board);
                            moves[currentArrayIndex] = this.colAndRowToCell(newCol, newRow);
                            currentArrayIndex++;
                        }
                    }
                    ;
                }
            }
            ;
        }
        return moves;
    };
    /**
     * @param  {number} color  An integer representing the color of
     * the current player.
     * 0 = WHITE  and  1 = BLACK
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of 'cells', as described
     * at the top of this doc.
     *
     * @return        {number} Returns TRUE if the given player's opponent has
     * gotten a 1-piece of theirs to the given
     * player's starting side of the board.  Only
     * moves that capture this 1-piece will be valid,
     * and failure to capture it will result in a
     * checkmate.
     * Returns FALSE if the given player's opponent
     * does not meet the above condition.
     * Returns a negative integer if an
     * error occurs.
     *
     * Returns ERR_INVALID_COLOR if the passed color
     * is not WHITE or BLACK.
     */
    API.prototype.isPlayerInCheck = function (color, board) {
        var rowToCheck;
        if (color === this.WHITE)
            rowToCheck = 9;
        else if (color === this.BLACK)
            rowToCheck = 0;
        else
            return this.ERR_INVALID_COLOR;
        for (var i = 0; i < this.BOARD_LENGTH; i++) {
            {
                if ((this.getPieceColor$int$int$java_lang_String_A_A(i, rowToCheck, board) === this.getOpponentColor(color)) && (this.getPieceMoveDistance$int$int$java_lang_String_A_A(i, rowToCheck, board) === 1))
                    return this.TRUE;
            }
            ;
        }
        return this.FALSE;
    };
    /**
     * @param  {number} color  An integer representing the color of
     * the current player.
     * 0 = WHITE  and  1 = BLACK
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of 'cells', as described
     * at the top of this doc.
     *
     * @return        {number} Assumes the given player's opponent has
     * gotten a 1-piece of theirs to the given
     * player's starting side of the board, and returns the column that 1-piece is in.  Only
     * moves that capture this 1-piece will be valid,
     * and failure to capture it will result in a
     * checkmate.
     * Returns a negative integer if an
     * error occurs.
     *
     * Returns NO_PIECE if the given player's opponent
     * does not meet the above condition.
     *
     * Returns ERR_INVALID_COLOR if the passed color
     * is not WHITE or BLACK.
     */
    API.prototype.whichColumnIsPlayerInCheck = function (color, board) {
        var rowToCheck;
        if (color === this.WHITE)
            rowToCheck = 9;
        else if (color === this.BLACK)
            rowToCheck = 0;
        else
            return this.ERR_INVALID_COLOR;
        for (var i = 0; i < this.BOARD_LENGTH; i++) {
            {
                if ((this.getPieceColor$int$int$java_lang_String_A_A(i, rowToCheck, board) === this.getOpponentColor(color)) && (this.getPieceMoveDistance$int$int$java_lang_String_A_A(i, rowToCheck, board) === 1))
                    return i;
            }
            ;
        }
        return this.NO_PIECE;
    };
    API.prototype.isMoveValid$java_lang_String$int$java_lang_String_A_A = function (moveString, myColor, board) {
        var moveCells = moveString.split(", ");
        if (moveCells.length !== 2)
            return this.ERR_FORMAT;
        var fromCell = moveCells[0];
        var toCell = moveCells[1];
        return this.isMoveValid$java_lang_String$java_lang_String$int$java_lang_String_A_A(fromCell, toCell, myColor, board);
    };
    API.prototype.isMoveValid$java_lang_String$java_lang_String$int$java_lang_String_A_A = function (fromCell, toCell, myColor, board) {
        if (fromCell == null || toCell == null || fromCell.length !== 2 || toCell.length !== 2)
            return this.ERR_FORMAT;
        var cellValidRet = this.isCellValid$java_lang_String(fromCell);
        if (cellValidRet !== this.TRUE)
            return this.ERR_FORMAT_MOVE_FROM;
        cellValidRet = this.isCellValid$java_lang_String(toCell);
        if (cellValidRet !== this.TRUE)
            return this.ERR_FORMAT_MOVE_TO;
        var pieceMoveDistance = this.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(fromCell, board);
        if (pieceMoveDistance === 0 || this.isMyPiece$java_lang_String$int$java_lang_String_A_A(fromCell, myColor, board) !== this.TRUE || this.isMyPiece$java_lang_String$int$java_lang_String_A_A(toCell, myColor, board) === this.TRUE)
            return this.FALSE;
        if ((Math.abs(this.cellToRow(fromCell) - this.cellToRow(toCell)) !== 0 && Math.abs(this.cellToCol(fromCell) - this.cellToCol(toCell)) !== pieceMoveDistance) || (Math.abs(this.cellToCol(fromCell) - this.cellToCol(toCell)) !== 0 && Math.abs(this.cellToCol(fromCell) - this.cellToCol(toCell)) !== pieceMoveDistance))
            return this.FALSE;
        return this.TRUE;
    };
    /**
     * @param  {string} fromCell   A string representation of the cell that
     * a piece starts in, with values "A0"-"J9".
     * @param  {string} toCell   A string representation of the cell that
     * a piece will land in, with values "A0"-"J9".
     * @param  {number} myColor  The integer representing your color WHITE=0, BLACK=1
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of 'cells', as described
     * at the top of this doc.
     * @return        {number} Returns TRUE if the passed move is valid.
     * Returns FALSE if the passed move is properly
     * formatted, but invalid.
     * Returns a negative integer if an error
     * occurs.
     * Returns ERR_FORMAT_MOVE_FROM if the string
     * representing the fromCell is invalid.
     * Returns ERR_FORMAT_MOVE_TO if the string
     * representing the toCell is invalid.
     * otherwise improperly formatted.
     * Returns ERR_FORMAT if the passed move is
     * otherwise improperly formatted.
     */
    API.prototype.isMoveValid = function (fromCell, toCell, myColor, board) {
        if (((typeof fromCell === 'string') || fromCell === null) && ((typeof toCell === 'string') || toCell === null) && ((typeof myColor === 'number') || myColor === null) && ((board != null && board instanceof Array && (board.length == 0 || board[0] == null || board[0] instanceof Array)) || board === null)) {
            return this.isMoveValid$java_lang_String$java_lang_String$int$java_lang_String_A_A(fromCell, toCell, myColor, board);
        }
        else if (((typeof fromCell === 'string') || fromCell === null) && ((typeof toCell === 'number') || toCell === null) && ((myColor != null && myColor instanceof Array && (myColor.length == 0 || myColor[0] == null || myColor[0] instanceof Array)) || myColor === null) && board === undefined) {
            return this.isMoveValid$java_lang_String$int$java_lang_String_A_A(fromCell, toCell, myColor);
        }
        else
            throw new Error('invalid overload');
    };
    API.prototype.isCellValid$java_lang_String = function (cell) {
        if (cell == null || cell.length !== 2)
            return this.ERR_FORMAT;
        var colChar = cell.charAt(0);
        var rowChar = cell.charAt(1);
        if ((function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(colChar) < 'A'.charCodeAt(0) || (function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(colChar) > 'J'.charCodeAt(0))
            return this.ERR_INVALID_COL;
        if ((function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(rowChar) < '0'.charCodeAt(0) || (function (c) { return c.charCodeAt == null ? c : c.charCodeAt(0); })(rowChar) > '9'.charCodeAt(0))
            return this.ERR_INVALID_ROW;
        return this.TRUE;
    };
    API.prototype.isCellValid$int$int = function (col, row) {
        if (col < 0 || col > 9)
            return this.ERR_INVALID_COL;
        if (row < 0 || row > 9)
            return this.ERR_INVALID_ROW;
        return this.TRUE;
    };
    /**
     * @param  {number} col    The index of the target cell's column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell's row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @return        {number} Returns TRUE, a positive integer, if the passed
     * cell is valid.
     * Returns a negative integer if it's invalid,
     * causing an error.
     * Returns ERR_INVALID_COL if the passed cell's
     * column is an invalid character.
     * Returns ERR_INVALID_ROW if the passed cell's
     * row is an invalid character.
     * Returns ERR_FORMAT if the passed cell is
     * otherwise improperly formatted.
     */
    API.prototype.isCellValid = function (col, row) {
        if (((typeof col === 'number') || col === null) && ((typeof row === 'number') || row === null)) {
            return this.isCellValid$int$int(col, row);
        }
        else if (((typeof col === 'string') || col === null) && row === undefined) {
            return this.isCellValid$java_lang_String(col);
        }
        else
            throw new Error('invalid overload');
    };
    return API;
}());
API["__class"] = "API";
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
 * @class
 */
var MediumAI = /** @class */ (function () {
    function MediumAI() {
        if (this.api === undefined) {
            this.api = null;
        }
        this.turnNumber = 0;
        this.api = new API();
    }
    /**
     * Please refer to the API for helper functions to code your starter AI
     *
     * @param {GameState} gameState the current state of the game
     * @return {string} a random move TODO change to return your choice of move
     */
    MediumAI.prototype.getMove = function (gameState) {
        this.turnNumber++;
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        switch ((this.turnNumber)) {
            case 1:
                if (this.api.getMyColor(gameState) === 0) {
                    return "C9, E7";
                }
                else {
                    return "H0, F2";
                }
            case 2:
                if (this.api.getMyColor(gameState) === 0) {
                    return "H9, F7";
                }
                else {
                    return "C0, E2";
                }
            case 3:
                if (this.api.getMyColor(gameState) === 0) {
                    return "E9, E5";
                }
                else {
                    return "F0, F4";
                }
            case 4:
                if (this.api.getMyColor(gameState) === 0) {
                    return "F9, F5";
                }
                else {
                    return "E0, E4";
                }
            case 5:
                if (this.api.getMyColor(gameState) === 0) {
                    if (this.getLeftThreeLocation(gameState) != null && !(this.getLeftThreeLocation(gameState) === ("E9"))) {
                        return "B9, E9";
                    }
                }
                else {
                    if (this.getLeftThreeLocation(gameState) != null && !(this.getLeftThreeLocation(gameState) === ("F0"))) {
                        return "I0, F0";
                    }
                }
            case 6:
                if (this.api.getMyColor(gameState) === 0) {
                    if (this.getRightThreeLocation(gameState) != null && !(this.getRightThreeLocation(gameState) === ("F9"))) {
                        return "I9, F9";
                    }
                }
                else {
                    if (this.getRightThreeLocation(gameState) != null && !(this.getRightThreeLocation(gameState) === ("E0"))) {
                        return "B0, E0";
                    }
                }
            case 7:
                if (this.api.getMyColor(gameState) === 0) {
                    if (this.api.getPieceColor$java_lang_String$java_lang_String_A_A("D9", board) === this.api.getMyColor(gameState) && this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A("D9", board) === 1) {
                        return "D9, C9";
                    }
                }
                else {
                    if (this.api.getPieceColor$java_lang_String$java_lang_String_A_A("G0", board) === this.api.getMyColor(gameState) && this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A("G0", board) === 1) {
                        return "G0, H0";
                    }
                }
            case 8:
                if (this.api.getMyColor(gameState) === 0) {
                    if (this.getOuterThreeLocation(gameState) != null && !(this.getOuterThreeLocation(gameState) === ("D9"))) {
                        return "A9, D9";
                    }
                }
                else {
                    if (this.getOuterThreeLocation(gameState) != null && !(this.getOuterThreeLocation(gameState) === ("G0"))) {
                        return "J0, G0";
                    }
                }
            default:
                if (this.api.isPlayerInCheck(this.api.getMyColor(gameState), board) === this.api.TRUE) {
                    var movesArray = this.getAllLegalCaptureMovesDifferentiated(gameState);
                    for (var i = 0; i < 9; i++) {
                        {
                            if ( /* isEmpty */(movesArray[i].length == 0))
                                continue;
                            return this.pickBestMoveFromList(gameState, movesArray[i]);
                        }
                        ;
                    }
                    var moves = this.getAllLegalTrade1For1Moves(gameState);
                    if (!(moves.length == 0)) {
                        return this.pickBestMoveFromList(gameState, moves);
                    }
                    else {
                        return "CHECKMATED";
                    }
                }
                else {
                    var movesArray = this.getAllLegalCaptureMovesDifferentiated(gameState);
                    for (var i = 0; i < 9; i++) {
                        {
                            if ( /* isEmpty */(movesArray[i].length == 0))
                                continue;
                            return this.pickBestMoveFromList(gameState, movesArray[i]);
                        }
                        ;
                    }
                    var moves = this.getAllLegalTradeF2ForB2Moves(gameState);
                    if (!(moves.length == 0)) {
                        return this.pickBestMoveFromList(gameState, moves);
                    }
                    moves = this.getAllLegalTrade1For1Moves(gameState);
                    if (!(moves.length == 0)) {
                        return this.pickBestMoveFromList(gameState, moves);
                    }
                    moves = this.getAllLegalNonCaptureNonFormationMoves(gameState);
                    if (!(moves.length == 0)) {
                        return this.pickBestMoveFromList(gameState, moves);
                    }
                }
                throw Object.defineProperty(new Error("either we got checkmated or error"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Error', 'java.lang.Object', 'java.lang.AssertionError'] });
        }
    };
    /**
     * Returns a legal random move given the current game state (i.e. must escape check).
     *
     * If no legal move exists, returns "CHECKMATED" to indicate one has lost
     * @param {GameState} gameState the current state of the game
     * @return {string} a random move
     */
    MediumAI.prototype.getRandomMove = function (gameState) {
        var moves = this.getAllLegalMoves(gameState);
        if ( /* size */moves.length === 0) {
            return "CHECKMATED";
        }
        return /* get */ moves[((Math.random() * /* size */ moves.length) | 0)];
    };
    /**
     *
     * Returns all legal moves
     *
     * @param {GameState} gameState the current state of the game
     * @return {string[]} an arraylist containing all legal moves
     */
    MediumAI.prototype.getAllLegalMoves = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        var moves = ([]);
        for (var index7552 = 0; index7552 < pieceLocations.length; index7552++) {
            var piece = pieceLocations[index7552];
            {
                if (piece === (""))
                    break;
                var validMoves = this.api.getValidMoves$java_lang_String$int$java_lang_String_A_A(piece, this.api.getMyColor(gameState), board);
                for (var index7553 = 0; index7553 < validMoves.length; index7553++) {
                    var move = validMoves[index7553];
                    {
                        if (move === (""))
                            break;
                        /* add */ (moves.push(piece + ", " + move) > 0);
                    }
                }
            }
        }
        return moves;
    };
    MediumAI.prototype.getAllLegalCaptureMovesDifferentiated = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        var movesArray = [null, null, null, null, null, null, null, null, null];
        for (var i = 0; i < 9; i++) {
            {
                movesArray[i] = ([]);
            }
            ;
        }
        for (var index7554 = 0; index7554 < pieceLocations.length; index7554++) {
            var piece = pieceLocations[index7554];
            {
                if (piece === (""))
                    break;
                var validMoves = this.api.getValidMoves$java_lang_String$int$java_lang_String_A_A(piece, this.api.getMyColor(gameState), board);
                for (var index7555 = 0; index7555 < validMoves.length; index7555++) {
                    var move = validMoves[index7555];
                    {
                        if (move === (""))
                            break;
                        if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, board) !== 0 && this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) > this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, board)) {
                            if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, board) === 1) {
                                if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 2) {
                                    if (this.api.cellToRow(piece) % 2 !== this.api.getMyColor(gameState)) {
                                        /* add */ (movesArray[2].push(piece + ", " + move) > 0);
                                    }
                                    else {
                                        /* add */ (movesArray[0].push(piece + ", " + move) > 0);
                                    }
                                }
                                else if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 3) {
                                    /* add */ (movesArray[1].push(piece + ", " + move) > 0);
                                }
                                else {
                                    /* add */ (movesArray[3].push(piece + ", " + move) > 0);
                                }
                            }
                            else if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, board) === 2) {
                                if (this.api.cellToRow(move) % 2 !== this.api.getOpponentColor(this.api.getMyColor(gameState))) {
                                    if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 3) {
                                        /* add */ (movesArray[4].push(piece + ", " + move) > 0);
                                    }
                                    else {
                                        /* add */ (movesArray[5].push(piece + ", " + move) > 0);
                                    }
                                }
                                else {
                                    if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 3) {
                                        /* add */ (movesArray[6].push(piece + ", " + move) > 0);
                                    }
                                    else {
                                        /* add */ (movesArray[7].push(piece + ", " + move) > 0);
                                    }
                                }
                            }
                            else {
                                /* add */ (movesArray[8].push(piece + ", " + move) > 0);
                            }
                        }
                    }
                }
            }
        }
        return movesArray;
    };
    MediumAI.prototype.getAllLegalNonCaptureNonFormationMoves = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        var moves = ([]);
        for (var index7556 = 0; index7556 < pieceLocations.length; index7556++) {
            var piece = pieceLocations[index7556];
            {
                if (piece === (""))
                    break;
                var validMoves = this.api.getValidMoves$java_lang_String$int$java_lang_String_A_A(piece, this.api.getMyColor(gameState), board);
                for (var index7557 = 0; index7557 < validMoves.length; index7557++) {
                    var move = validMoves[index7557];
                    {
                        if (move === (""))
                            break;
                        if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, board) === 0) {
                            if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 1 || (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 2) && this.api.cellToRow(piece) % 2 === this.api.getMyColor(gameState)) {
                                /* add */ (moves.push(piece + ", " + move) > 0);
                            }
                        }
                    }
                }
            }
        }
        return moves;
    };
    MediumAI.prototype.getAllLegalTradeF2ForB2Moves = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        var moves = ([]);
        for (var index7558 = 0; index7558 < pieceLocations.length; index7558++) {
            var piece = pieceLocations[index7558];
            {
                if (piece === (""))
                    break;
                var validMoves = this.api.getValidMoves$java_lang_String$int$java_lang_String_A_A(piece, this.api.getMyColor(gameState), board);
                for (var index7559 = 0; index7559 < validMoves.length; index7559++) {
                    var move = validMoves[index7559];
                    {
                        if (move === (""))
                            break;
                        if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 2 && this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, board) === 2 && this.api.cellToRow(piece) % 2 === this.api.getMyColor(gameState)) {
                            /* add */ (moves.push(piece + ", " + move) > 0);
                        }
                    }
                }
            }
        }
        return moves;
    };
    MediumAI.prototype.getAllLegalTrade1For1Moves = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        var moves = ([]);
        for (var index7560 = 0; index7560 < pieceLocations.length; index7560++) {
            var piece = pieceLocations[index7560];
            {
                if (piece === (""))
                    break;
                var validMoves = this.api.getValidMoves$java_lang_String$int$java_lang_String_A_A(piece, this.api.getMyColor(gameState), board);
                for (var index7561 = 0; index7561 < validMoves.length; index7561++) {
                    var move = validMoves[index7561];
                    {
                        if (move === (""))
                            break;
                        if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 1 && this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, board) === 1) {
                            /* add */ (moves.push(piece + ", " + move) > 0);
                        }
                    }
                }
            }
        }
        return moves;
    };
    /**
     * Returns all legal moves that capture (not trade) a piece
     *
     * @param {GameState} gameState the current state of the game
     * @return {string[]} an arraylist containing all legal moves that capture (not trade) a piece
     */
    MediumAI.prototype.getAllLegalCaptureMoves = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        var moves = ([]);
        for (var index7562 = 0; index7562 < pieceLocations.length; index7562++) {
            var piece = pieceLocations[index7562];
            {
                if (piece === (""))
                    break;
                var validMoves = this.api.getValidMoves$java_lang_String$int$java_lang_String_A_A(piece, this.api.getMyColor(gameState), board);
                for (var index7563 = 0; index7563 < validMoves.length; index7563++) {
                    var move = validMoves[index7563];
                    {
                        if (move === (""))
                            break;
                        if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, board) !== 0 && this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) > this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, board)) {
                            /* add */ (moves.push(piece + ", " + move) > 0);
                        }
                    }
                }
            }
        }
        return moves;
    };
    /**
     * Returns all legal moves that capture (not trade) a 1-piece
     *
     * @param {GameState} gameState the current state of the game
     * @return {string[]} an arraylist containing all legal moves that capture (not trade) a 1-piece
     */
    MediumAI.prototype.getAllLegalCapture1PieceMoves = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        var moves = ([]);
        for (var index7564 = 0; index7564 < pieceLocations.length; index7564++) {
            var piece = pieceLocations[index7564];
            {
                if (piece === (""))
                    break;
                var validMoves = this.api.getValidMoves$java_lang_String$int$java_lang_String_A_A(piece, this.api.getMyColor(gameState), board);
                for (var index7565 = 0; index7565 < validMoves.length; index7565++) {
                    var move = validMoves[index7565];
                    {
                        if (move === (""))
                            break;
                        if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, board) === 1 && this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) > this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, board)) {
                            /* add */ (moves.push(piece + ", " + move) > 0);
                        }
                    }
                }
            }
        }
        return moves;
    };
    MediumAI.prototype.tryThisMove = function (gameState, moveString) {
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
    };
    MediumAI.prototype.nonFormationPiecesExposedToCapture = function (gameState, newBoard) {
        if (newBoard == null) {
            return 1000000;
        }
        var myPieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), newBoard);
        var my1PieceLocations = ([]);
        var myF2PieceLocations = ([]);
        for (var index7566 = 0; index7566 < myPieceLocations.length; index7566++) {
            var piece = myPieceLocations[index7566];
            {
                if (piece === (""))
                    break;
                if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, newBoard) === 1) {
                    /* add */ (my1PieceLocations.push(piece) > 0);
                }
                else if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, newBoard) === 2 && this.api.cellToRow(piece) % 2 === this.api.getMyColor(gameState)) {
                    /* add */ (myF2PieceLocations.push(piece) > 0);
                }
            }
        }
        var my1PiecesRemaining = my1PieceLocations.length;
        var myF2PiecesRemaining = myF2PieceLocations.length;
        var opponentPieceLocations = this.api.getMyPieceLocations(this.api.getOpponentColor(this.api.getMyColor(gameState)), newBoard);
        for (var index7567 = 0; index7567 < opponentPieceLocations.length; index7567++) {
            var piece = opponentPieceLocations[index7567];
            {
                if (piece === (""))
                    break;
                var validMoves = this.api.getValidMoves$java_lang_String$int$java_lang_String_A_A(piece, this.api.getOpponentColor(this.api.getMyColor(gameState)), newBoard);
                var _loop_1 = function (index7568) {
                    var move = validMoves[index7568];
                    {
                        if (move === (""))
                            return "break";
                        if (this_1.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, newBoard) !== 0 && this_1.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, newBoard) > this_1.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(move, newBoard)) {
                            if ( /* contains */(my1PieceLocations.indexOf((move)) >= 0)) {
                                /* remove */ (function (a) { var index = a.indexOf(move); if (index >= 0) {
                                    a.splice(index, 1);
                                    return true;
                                }
                                else {
                                    return false;
                                } })(my1PieceLocations);
                            }
                            else if ( /* contains */(myF2PieceLocations.indexOf((move)) >= 0)) {
                                /* remove */ (function (a) { var index = a.indexOf(move); if (index >= 0) {
                                    a.splice(index, 1);
                                    return true;
                                }
                                else {
                                    return false;
                                } })(myF2PieceLocations);
                            }
                        }
                    }
                };
                var this_1 = this;
                for (var index7568 = 0; index7568 < validMoves.length; index7568++) {
                    var state_1 = _loop_1(index7568);
                    if (state_1 === "break")
                        break;
                }
            }
        }
        return (my1PiecesRemaining - /* size */ my1PieceLocations.length) * 11 + (myF2PiecesRemaining - /* size */ myF2PieceLocations.length) * 10;
    };
    MediumAI.prototype.pickBestMoveFromList = function (gameState, moves) {
        if ( /* isEmpty */(moves.length == 0)) {
            throw Object.defineProperty(new Error("i think we got checkmated"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Error', 'java.lang.Object', 'java.lang.AssertionError'] });
        }
        var bestMoveIndex = 0;
        var bestMoveEvaluation = 1000001;
        for (var j = 0; j < /* size */ moves.length; j++) {
            {
                var evaluation = this.nonFormationPiecesExposedToCapture(gameState, this.tryThisMove(gameState, /* get */ moves[j]));
                if (evaluation < bestMoveEvaluation) {
                    bestMoveIndex = j;
                    bestMoveEvaluation = evaluation;
                }
                else if (evaluation === bestMoveEvaluation) {
                    if (Math.random() < 0.1) {
                        bestMoveIndex = j;
                        bestMoveEvaluation = evaluation;
                    }
                }
            }
            ;
        }
        return /* get */ moves[bestMoveIndex];
    };
    MediumAI.prototype.isInPartialFormation = function (gameState) {
        if (this.api.getMyColor(gameState) === 0) {
            return (this.getLeftTwoLocation(gameState) === ("E7")) && (this.getRightTwoLocation(gameState) === ("F7")) && (this.getLeftFourLocation(gameState) === ("E5")) && (this.getRightFourLocation(gameState) === ("F5"));
        }
        else {
            return (this.getLeftTwoLocation(gameState) === ("F2")) && (this.getRightTwoLocation(gameState) === ("E2")) && (this.getLeftFourLocation(gameState) === ("F4")) && (this.getRightFourLocation(gameState) === ("E4"));
        }
    };
    MediumAI.prototype.isInFullFormation = function (gameState) {
        if (this.api.getMyColor(gameState) === 0) {
            return this.isInPartialFormation(gameState) && (this.getOuterThreeLocation(gameState) === ("D9")) && (this.getLeftThreeLocation(gameState) === ("E9")) && (this.getRightThreeLocation(gameState) === ("F9"));
        }
        else {
            return this.isInPartialFormation(gameState) && (this.getOuterThreeLocation(gameState) === ("G0")) && (this.getLeftThreeLocation(gameState) === ("F0")) && (this.getRightThreeLocation(gameState) === ("E0"));
        }
    };
    MediumAI.prototype.isInPartialFormationOrCaptured = function (gameState) {
        if (this.api.getMyColor(gameState) === 0) {
            return (this.getLeftTwoLocation(gameState) == null || (this.getLeftTwoLocation(gameState) === ("E7"))) && (this.getRightTwoLocation(gameState) == null || (this.getRightTwoLocation(gameState) === ("F7"))) && (this.getLeftFourLocation(gameState) === ("E5")) && (this.getRightFourLocation(gameState) === ("F5"));
        }
        else {
            return (this.getLeftTwoLocation(gameState) == null || (this.getLeftTwoLocation(gameState) === ("F2"))) && (this.getRightTwoLocation(gameState) == null || (this.getRightTwoLocation(gameState) === ("E2"))) && (this.getLeftFourLocation(gameState) === ("F4")) && (this.getRightFourLocation(gameState) === ("E4"));
        }
    };
    MediumAI.prototype.isInFullFormationOrCaptured = function (gameState) {
        if (this.api.getMyColor(gameState) === 0) {
            return this.isInPartialFormationOrCaptured(gameState) && (this.getOuterThreeLocation(gameState) == null || (this.getOuterThreeLocation(gameState) === ("D9"))) && (this.getLeftThreeLocation(gameState) == null || (this.getLeftThreeLocation(gameState) === ("E9"))) && (this.getRightThreeLocation(gameState) == null || (this.getRightThreeLocation(gameState) === ("F9")));
        }
        else {
            return this.isInPartialFormationOrCaptured(gameState) && (this.getOuterThreeLocation(gameState) == null || (this.getOuterThreeLocation(gameState) === ("G0"))) && (this.getLeftThreeLocation(gameState) == null || (this.getLeftThreeLocation(gameState) === ("F0"))) && (this.getRightThreeLocation(gameState) == null || (this.getRightThreeLocation(gameState) === ("E0")));
        }
    };
    MediumAI.prototype.getLeftTwoLocation = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        for (var index7569 = 0; index7569 < pieceLocations.length; index7569++) {
            var piece = pieceLocations[index7569];
            {
                if (piece === (""))
                    break;
                if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 2 && this.api.cellToRow(piece) % 2 !== this.api.getMyColor(gameState) && this.api.cellToCol(piece) % 2 === this.api.getMyColor(gameState)) {
                    return piece;
                }
            }
        }
        return null;
    };
    MediumAI.prototype.getRightTwoLocation = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        for (var index7570 = 0; index7570 < pieceLocations.length; index7570++) {
            var piece = pieceLocations[index7570];
            {
                if (piece === (""))
                    break;
                if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 2 && this.api.cellToRow(piece) % 2 !== this.api.getMyColor(gameState) && this.api.cellToCol(piece) % 2 !== this.api.getMyColor(gameState)) {
                    return piece;
                }
            }
        }
        return null;
    };
    MediumAI.prototype.getOuterThreeLocation = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        for (var index7571 = 0; index7571 < pieceLocations.length; index7571++) {
            var piece = pieceLocations[index7571];
            {
                if (piece === (""))
                    break;
                if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 3 && this.api.cellToCol(piece) % 3 === 0) {
                    return piece;
                }
            }
        }
        return null;
    };
    MediumAI.prototype.getLeftThreeLocation = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        for (var index7572 = 0; index7572 < pieceLocations.length; index7572++) {
            var piece = pieceLocations[index7572];
            {
                if (piece === (""))
                    break;
                if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 3 && this.api.cellToCol(piece) % 3 === this.api.getMyColor(gameState) + 1) {
                    return piece;
                }
            }
        }
        return null;
    };
    MediumAI.prototype.getRightThreeLocation = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        for (var index7573 = 0; index7573 < pieceLocations.length; index7573++) {
            var piece = pieceLocations[index7573];
            {
                if (piece === (""))
                    break;
                if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 3 && this.api.cellToCol(piece) % 3 === 2 - this.api.getMyColor(gameState)) {
                    return piece;
                }
            }
        }
        return null;
    };
    MediumAI.prototype.getLeftFourLocation = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        for (var index7574 = 0; index7574 < pieceLocations.length; index7574++) {
            var piece = pieceLocations[index7574];
            {
                if (piece === (""))
                    break;
                if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 4 && this.api.cellToCol(piece) % 4 === this.api.getMyColor(gameState)) {
                    return piece;
                }
            }
        }
        throw Object.defineProperty(new Error("bug captured four"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Error', 'java.lang.Object', 'java.lang.AssertionError'] });
    };
    MediumAI.prototype.getRightFourLocation = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        for (var index7575 = 0; index7575 < pieceLocations.length; index7575++) {
            var piece = pieceLocations[index7575];
            {
                if (piece === (""))
                    break;
                if (this.api.getPieceMoveDistance$java_lang_String$java_lang_String_A_A(piece, board) === 4 && this.api.cellToCol(piece) % 4 === this.api.getOpponentColor(this.api.getMyColor(gameState))) {
                    return piece;
                }
            }
        }
        throw Object.defineProperty(new Error("bug captured four"), '__classes', { configurable: true, value: ['java.lang.Throwable', 'java.lang.Error', 'java.lang.Object', 'java.lang.AssertionError'] });
    };
    return MediumAI;
}());
MediumAI["__class"] = "MediumAI";