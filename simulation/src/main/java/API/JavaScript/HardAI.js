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
     * board, comprised of ���cells���, as described
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
     * @param  {number} col    The index of the target cell���s column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell���s row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of ���cells���, as described
     * at the top of this doc.
     * @return        {string} The two-character representation of a ���cell���,
     * with ������ being an empty cell with no piece, and
     * ���b1��� representing one the black-side player���s
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
     * @param  {string} cell   The position of the cell on the board, from values ���A0��� to ���J9���.
     *
     * @return        {number} The index of the target cell���s column in the
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
     * values ���A0��� to ���J9���.
     * @return        {number} The index of the target cell���s row in the
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
     * @param  {number} col    The index of the target col���s row in the
     * String[][] board.
     *
     * @return        {string} The column of the cell on the board, from
     * characters A-J. See diagram at top of doc.
     */
    API.prototype.colToColChar = function (col) {
        return String.fromCharCode((col + 'A'.charCodeAt(0)));
    };
    /**
     * @param  {number} row    The index of the target row���s row in the
     * String[][] board.
     *
     * @return        {string} The row of the cell on the board, from
     * characters 0-9. See diagram at top of doc.
     */
    API.prototype.rowToRowChar = function (row) {
        return /* toString */ ('' + (row)).charAt(0);
    };
    /**
     * @param  {number} col    The index of the target cell���s column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell���s row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @return        {string} The two-character position of the cell on the
     * board, from values ���A0��� to ���J9���, that
     * corresponds to the passed row and column
     * indices.
     * For example, colAndRowToCell(2, 4) returns ���C4���
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
     * @param  {number} col    The index of the target cell���s column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell���s row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of ���cells���, as described
     * at the top of this doc.
     *
     * @return        {number} Returns TRUE if the given cell is storing a
     * string representing a piece, like ���b3��� or ���w1���.
     * False if the cell is storing ������.
     * Returns a negative integer if an error
     * occurs.
     *
     * Returns ERR_INVALID_COL if the passed cell���s
     * column is an invalid character.
     * Returns ERR_INVALID_ROW if the passed cell���s
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
     * @param  {number} col    The index of the target cell���s column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell���s row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of ���cells���, as described
     * at the top of this doc.
     * @param  {number} myColor  The integer representing your color WHITE=0, BLACK=1
     * @return        {number} Returns TRUE if the given cell is storing a
     * string representing a piece of yours.  I.e.
     * ���b3��� if you are on black-side.
     * Returns FALSE if the above condition isn���t met.
     * Returns a negative integer if an error
     * occurs.
     * Returns ERR_INVALID_COL if the passed cell���s
     * column is an invalid character.
     * Returns ERR_INVALID_ROW if the passed cell���s
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
     * @param  {number} col    The index of the target cell���s column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell���s row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of ���cells���, as described
     * at the top of this doc.
     * @return        {number} An integer representing the color/owner of the
     * piece.  0 = WHITE, 1 = BLACK, and -1 = NO_PIECE
     * Returns a negative integer if an error
     * occurs.
     * Returns ERR_INVALID_COL if the passed cell���s
     * column is an invalid character.
     * Returns ERR_INVALID_ROW if the passed cell���s
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
     * @param  {number} col    The index of the target cell���s column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell���s row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of ���cells���, as described
     * at the top of this doc.
     * @return        {number} An integer representing the color/owner of the
     * piece.  0 = WHITE, 1 = BLACK, and -1 = NO_PIECE
     * Returns a negative integer if an error
     * occurs.
     * Returns ERR_INVALID_COL if the passed cell���s
     * column is an invalid character.
     * Returns ERR_INVALID_ROW if the passed cell���s
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
     * @param  {number} col    The index of the target cell���s column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell���s row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @param  {number} myColor  The integer representing your color WHITE=0, BLACK=1
     * @param  {java.lang.String[][]} board  The String[][] representation of the game
     * board, comprised of ���cells���, as described
     * at the top of this doc.
     * @return        {java.lang.String[]} An array of all cell positions that the piece
     * in the current cell can move to, represented
     * like [���E7���, ���G7���, ���E6���, ���H8���].  If the owner of
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
     * board, comprised of ���cells���, as described
     * at the top of this doc.
     *
     * @return        {number} Returns TRUE if the given player���s opponent has
     * gotten a 1-piece of theirs to the given
     * player���s starting side of the board.  Only
     * moves that capture this 1-piece will be valid,
     * and failure to capture it will result in a
     * checkmate.
     * Returns FALSE if the given player���s opponent
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
     * board, comprised of ���cells���, as described
     * at the top of this doc.
     *
     * @return        {number} Assumes the given player���s opponent has
     * gotten a 1-piece of theirs to the given
     * player���s starting side of the board, and returns the column that 1-piece is in.  Only
     * moves that capture this 1-piece will be valid,
     * and failure to capture it will result in a
     * checkmate.
     * Returns a negative integer if an
     * error occurs.
     *
     * Returns NO_PIECE if the given player���s opponent
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
     * board, comprised of ���cells���, as described
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
     * @param  {number} col    The index of the target cell���s column in the
     * String[][] board, retrieved through using
     * cellToCol().
     * @param  {number} row    The index of the target cell���s row in the
     * String[][] board, retrieved through using
     * cellToRow().
     * @return        {number} Returns TRUE, a positive integer, if the passed
     * cell is valid.
     * Returns a negative integer if it���s invalid,
     * causing an error.
     * Returns ERR_INVALID_COL if the passed cell���s
     * column is an invalid character.
     * Returns ERR_INVALID_ROW if the passed cell���s
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
var HardAI = /** @class */ (function () {
    function HardAI() {
        if (this.api === undefined) {
            this.api = null;
        }
        this.pieceValueOfWhite1s = [-1000000, 0, 200, 341, 446, 550, 653, 755, 856, 956];
        this.pieceValueOfWhiteLF2s = [0, 90, 170];
        this.pieceValueOfWhiteRF2s = [0, 90, 170];
        this.pieceValueOfWhiteB2s = [0, 95, 200];
        this.pieceValueOfWhite3s = [0, 85, 170, 255];
        this.allFourWhite2sBonus = 10;
        this.pieceValueOfBlack1s = [1000000, 0, -200, -341, -446, -550, -653, -755, -856, -956];
        this.pieceValueOfBlackLF2s = [0, -90, -170];
        this.pieceValueOfBlackRF2s = [0, -90, -170];
        this.pieceValueOfBlackB2s = [0, -95, -200];
        this.pieceValueOfBlack3s = [0, -85, -170, -255];
        this.allFourBlack2sBonus = -10;
        this.attackValueOnBlack1s = [500000, 100, 70, 52, 52, 51, 51, 50, 50];
        this.attackValueOnBlackLF2s = [45, 40];
        this.attackValueOnBlackRF2s = [45, 40];
        this.attackValueOnBlackB2s = [47, 53];
        this.attackValueOnBlack3s = [42, 42, 42];
        this.attackOnBlack2sBonus = 5;
        this.attackValueOnWhite1s = [-500000, -100, -70, -52, -52, -51, -51, -50, -50];
        this.attackValueOnWhiteLF2s = [-45, -40];
        this.attackValueOnWhiteRF2s = [-45, -40];
        this.attackValueOnWhiteB2s = [-47, -53];
        this.attackValueOnWhite3s = [-42, -42, -42];
        this.attackOnWhite2sBonus = -5;
        this.positionalValueOfWhite1s = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        this.positionalValueOfWhite2s = [[-4, 0, 3, -2, -2, 2, -2, 3, -3, -1], [-4, 0, 3, -2, -2, 2, -2, 3, -3, -1], [-1, 1, 4, -1, 4, 3, -1, 4, 2, 0], [-1, 1, 4, -1, 4, 3, -1, 4, 2, 0], [-2, 2, 5, 0, 0, 4, 0, 5, -1, 1], [-2, 2, 5, 0, 0, 4, 0, 5, -1, 1], [-1, 1, 4, -1, 4, 3, -1, 4, 2, 0], [-1, 1, 4, -1, 4, 3, -1, 4, 2, 0], [-4, 0, 3, -2, -2, 2, -2, 3, -3, -1], [-4, 0, 3, -2, -2, 2, -2, 3, -3, -1]];
        this.positionalValueOfWhite3s = [[-2, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0], [-2, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0], [0, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0], [0, -1000000, -1000000, 3, -1000000, -1000000, 3, -1000000, -1000000, 2], [-2, -1000000, -1000000, 3, -1000000, -1000000, 3, -1000000, -1000000, 2], [-2, -1000000, -1000000, 3, -1000000, -1000000, 3, -1000000, -1000000, 2], [0, -1000000, -1000000, 3, -1000000, -1000000, 3, -1000000, -1000000, 2], [0, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0], [-2, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0], [-2, -1000000, -1000000, 1, -1000000, -1000000, 1, -1000000, -1000000, 0]];
        this.positionalValueOfWhite4s = [[-1000000, 0, -1000000, -1000000, -1000000, 2, -1000000, -1000000, -1000000, 0], [-1000000, 0, -1000000, -1000000, -1000000, 2, -1000000, -1000000, -1000000, 0], [-1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000], [-1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000], [-1000000, 2, -1000000, -1000000, -1000000, 5, -1000000, -1000000, -1000000, 2], [-1000000, 2, -1000000, -1000000, -1000000, 5, -1000000, -1000000, -1000000, 2], [-1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000], [-1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000, -1000000], [-1000000, 0, -1000000, -1000000, -1000000, 2, -1000000, -1000000, -1000000, 0], [-1000000, 0, -1000000, -1000000, -1000000, 2, -1000000, -1000000, -1000000, 0]];
        this.positionalValueOfBlack1s = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        this.positionalValueOfBlack2s = [[1, 3, -3, 2, -2, 2, 2, -3, 0, 4], [1, 3, -3, 2, -2, 2, 2, -3, 0, 4], [0, -2, -4, 1, -3, -4, 1, -4, -1, 1], [0, -2, -4, 1, -3, -4, 1, -4, -1, 1], [-1, 1, -5, 0, -4, 0, 0, -5, -2, 2], [-1, 1, -5, 0, -4, 0, 0, -5, -2, 2], [0, -2, -4, 1, -3, -4, 1, -4, -1, 1], [0, -2, -4, 1, -3, -4, 1, -4, -1, 1], [1, 3, -3, 2, -2, 2, 2, -3, 0, 4], [1, 3, -3, 2, -2, 2, 2, -3, 0, 4]];
        this.positionalValueOfBlack3s = [[0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 2], [0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 2], [0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 0], [-2, 1000000, 1000000, -3, 1000000, 1000000, -3, 1000000, 1000000, 0], [-2, 1000000, 1000000, -3, 1000000, 1000000, -3, 1000000, 1000000, 2], [-2, 1000000, 1000000, -3, 1000000, 1000000, -3, 1000000, 1000000, 2], [-2, 1000000, 1000000, -3, 1000000, 1000000, -3, 1000000, 1000000, 0], [0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 0], [0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 2], [0, 1000000, 1000000, -1, 1000000, 1000000, -1, 1000000, 1000000, 2]];
        this.positionalValueOfBlack4s = [[0, 1000000, 1000000, 1000000, -2, 1000000, 1000000, 1000000, 0, 1000000], [0, 1000000, 1000000, 1000000, -2, 1000000, 1000000, 1000000, 0, 1000000], [1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000], [1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000], [-2, 1000000, 1000000, 1000000, -5, 1000000, 1000000, 1000000, -2, 1000000], [-2, 1000000, 1000000, 1000000, -5, 1000000, 1000000, 1000000, -2, 1000000], [1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000], [1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000], [0, 1000000, 1000000, 1000000, -2, 1000000, 1000000, 1000000, 0, 1000000], [0, 1000000, 1000000, 1000000, -2, 1000000, 1000000, 1000000, 0, 1000000]];
        this.api = new API();
    }
    /**
     * Hard AI uses a 1-ply minimax algorithm based on the evaluation function to determine its next move
     * @param {GameState} gameState you know what
     * @return {string} you know what
     */
    HardAI.prototype.getMove = function (gameState) {
        if (this.api.getMyColor(gameState) === this.api.WHITE) {
            var max = -10000000;
            var maxIndex = -1;
            var index = -1;
            var myMoves = this.getAllLegalMoves(gameState);
            for (var index7576 = 0; index7576 < myMoves.length; index7576++) {
                var myMove = myMoves[index7576];
                {
                    index++;
                    var min = 10000000;
                    var newBoard = this.tryThisMove$GameState$java_lang_String(gameState, myMove);
                    var pieceLocations = this.api.getMyPieceLocations(this.api.BLACK, newBoard);
                    var opponentMoves = ([]);
                    for (var index7577 = 0; index7577 < pieceLocations.length; index7577++) {
                        var piece = pieceLocations[index7577];
                        {
                            if (piece === (""))
                                break;
                            var validMoves = this.api.getValidMoves$java_lang_String$int$java_lang_String_A_A(piece, this.api.BLACK, newBoard);
                            for (var index7578 = 0; index7578 < validMoves.length; index7578++) {
                                var move = validMoves[index7578];
                                {
                                    if (move === (""))
                                        break;
                                    /* add */ (opponentMoves.push(piece + ", " + move) > 0);
                                }
                            }
                        }
                    }
                    for (var index7579 = 0; index7579 < opponentMoves.length; index7579++) {
                        var opponentMove = opponentMoves[index7579];
                        {
                            var newNewBoard = this.tryThisMove$java_lang_String_A_A$java_lang_String(newBoard, opponentMove);
                            var evaluation = this.evaluatePosition(newNewBoard, this.api.WHITE);
                            if (evaluation < min) {
                                min = evaluation;
                            }
                        }
                    }
                    if (min > max) {
                        max = min;
                        maxIndex = index;
                    }
                }
            }
            if (maxIndex === -1) {
                return "CHECKMATED";
            }
            return /* get */ myMoves[maxIndex];
        }
        else {
            var max = 10000000;
            var maxIndex = -1;
            var index = -1;
            var myMoves = this.getAllLegalMoves(gameState);
            for (var index7580 = 0; index7580 < myMoves.length; index7580++) {
                var myMove = myMoves[index7580];
                {
                    index++;
                    var min = -10000000;
                    var newBoard = this.tryThisMove$GameState$java_lang_String(gameState, myMove);
                    var pieceLocations = this.api.getMyPieceLocations(this.api.WHITE, newBoard);
                    var opponentMoves = ([]);
                    for (var index7581 = 0; index7581 < pieceLocations.length; index7581++) {
                        var piece = pieceLocations[index7581];
                        {
                            if (piece === (""))
                                break;
                            var validMoves = this.api.getValidMoves$java_lang_String$int$java_lang_String_A_A(piece, this.api.WHITE, newBoard);
                            for (var index7582 = 0; index7582 < validMoves.length; index7582++) {
                                var move = validMoves[index7582];
                                {
                                    if (move === (""))
                                        break;
                                    /* add */ (opponentMoves.push(piece + ", " + move) > 0);
                                }
                            }
                        }
                    }
                    for (var index7583 = 0; index7583 < opponentMoves.length; index7583++) {
                        var opponentMove = opponentMoves[index7583];
                        {
                            var newNewBoard = this.tryThisMove$java_lang_String_A_A$java_lang_String(newBoard, opponentMove);
                            var evaluation = this.evaluatePosition(newNewBoard, this.api.BLACK);
                            if (evaluation > min) {
                                min = evaluation;
                            }
                        }
                    }
                    if (min < max) {
                        max = min;
                        maxIndex = index;
                    }
                }
            }
            if (maxIndex === -1) {
                return "CHECKMATED";
            }
            return /* get */ myMoves[maxIndex];
        }
    };
    HardAI.prototype.getAllLegalMoves = function (gameState) {
        var board = this.api.getBoard(gameState);
        var pieceLocations = this.api.getMyPieceLocations(this.api.getMyColor(gameState), board);
        var moves = ([]);
        for (var index7584 = 0; index7584 < pieceLocations.length; index7584++) {
            var piece = pieceLocations[index7584];
            {
                if (piece === (""))
                    break;
                var validMoves = this.api.getValidMoves$java_lang_String$int$java_lang_String_A_A(piece, this.api.getMyColor(gameState), board);
                for (var index7585 = 0; index7585 < validMoves.length; index7585++) {
                    var move = validMoves[index7585];
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
    HardAI.prototype.tryThisMove$GameState$java_lang_String = function (gameState, moveString) {
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
        }
        board[fromCol][fromRow] = "";
        return board;
    };
    HardAI.prototype.tryThisMove = function (gameState, moveString) {
        if (((gameState != null && gameState instanceof GameState) || gameState === null) && ((typeof moveString === 'string') || moveString === null)) {
            return this.tryThisMove$GameState$java_lang_String(gameState, moveString);
        }
        else if (((gameState != null && gameState instanceof Array && (gameState.length == 0 || gameState[0] == null || gameState[0] instanceof Array)) || gameState === null) && ((typeof moveString === 'string') || moveString === null)) {
            return this.tryThisMove$java_lang_String_A_A$java_lang_String(gameState, moveString);
        }
        else
            throw new Error('invalid overload');
    };
    HardAI.prototype.tryThisMove$java_lang_String_A_A$java_lang_String = function (original, moveString) {
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
}());
HardAI["__class"] = "HardAI";
