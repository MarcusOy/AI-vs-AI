package API.Java;

import Simulation.GameState;

public class API {
	// cell values are NEVER null - they should be "" if empty

	public final int NUM_PIECES_PER_SIDE = 20;
	public final int NUM_PAWNS_PER_SIDE = 9;
	public final int BOARD_LENGTH = 10;
	
	public final int MIN_MOVE_DISTANCE = 1;
	public final int MAX_MOVE_DISTANCE = 4;
	
	public final char WHITE_CHAR = 'w';
	public final char BLACK_CHAR = 'b';

	public final int VALID_MOVES_ARRAY_LENGTH = 81;
	// 10x10 board, B,W colors,  

	public final int TRUE = 1;
	public final int FALSE = 0;

	public final int WHITE = 0;
	public final int BLACK = 1;
	public final int NO_PIECE = -1;

	public final int ERR_INVALID_COLOR = -2;
	public final int ERR_INVALID_COL = -3;
	public final int ERR_INVALID_ROW = -4;
	public final int ERR_FORMAT = -5;
	public final int ERR_FORMAT_MOVE_FROM = -6;
	public final int ERR_FORMAT_MOVE_TO = -7;

	// This constructor is just so these functions can be used in the console app
	public API () { }

	/*
	--------------------
       Baseline Setup
    --------------------
    */
	
	
	/**
	* @param  gameState  The GameState object sent from the
	*					 simulation service every time.  This stores
	*					 all the information about the current state
	*					 of the game, including a field that stores
	*					 the String[][] board.
	* 					 
	* @return            The String[][] representation of the game
	 					 board, comprised of ‘cells’, as described
	 					 at the top of this doc.
	*/
	public String[][] getBoard(GameState gameState) {
		return gameState.board;
	}
	
	
	
	/**
	* @param  gameState  The GameState object sent from the 
	*					 simulation service every time.  This
	*					 stores all the information about the
	*					 current state
	*					 of the game, including which color
	*					 the current player is.
	*
	* @return		  	 An integer representing the color of
	* 				 	 the current player.
	* 				 	 0 = WHITE  and  1 = BLACK
	*/
	public int getMyColor(GameState gameState) {
		return gameState.currentPlayer;
	}
	
	
	
	/**
	* @return		  	 An integer representing the color of
	* 				 	 the not current player.
	* 				 	 0 = WHITE  and  1 = BLACK
	 * 				 	 Returns a negative integer, ERR_INVALID_COLOR,
	 * 				 	 if myColor is invalid
	*/
	public int getOpponentColor(int myColor) {
		if (myColor == WHITE)
			return BLACK;
		else if (myColor == BLACK)
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
	* @param  cell   The position of the cell on the board, from
	*				 values “A0” to “J9”.
	* @param  board  The String[][] representation of the game
	*				 board, comprised of ‘cells’, as described
	*				 at the top of this doc.
	*
	* @return        The two-character representation of a ‘cell’,
	*			  	 with “” being an empty cell with no piece, and
	*			  	 “b1” representing one the black-side player’s
	*			  	 1 pieces.
	*/
	public String getCellValue(String cell, String[][] board) {
		String foundVal = getCellValue(cellToCol(cell), cellToRow(cell), board);
		
		if (foundVal == null || foundVal.length() != 2)
			return "";
		
		return foundVal;
	}
	/**
	 * @param  col    The index of the target cell’s column in the
	 *				 String[][] board, retrieved through using
	 *				 cellToCol().
	 * @param  row    The index of the target cell’s row in the
	 *				 String[][] board, retrieved through using
	 *				 cellToRow().
	 * @param  board  The String[][] representation of the game
	 *				 board, comprised of ‘cells’, as described
	 *				 at the top of this doc.
	 * @return        The two-character representation of a ‘cell’,
	 *			  	 with “” being an empty cell with no piece, and
	 *			  	 “b1” representing one the black-side player’s
	 *			  	 1 pieces.
	 */
	public String getCellValue(int col, int row, String[][] board) {
		return board[col][row];
	}

	
	
	/*
	--------------------
       Array Indexing
    --------------------
    */
	
	
	
	/**
	* @param  cell   The position of the cell on the board, from values “A0” to “J9”.
	* 
	* @return        The index of the target cell’s column in the
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
	public int cellToCol(String cell) {
        int isCellValidRet = isCellValid(cell);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

        return cellToColChar(cell) - 'A';
	}
		
	
	
	/**
	* @param  cell   The position of the cell on the board, from
	* 				 values “A0” to “J9”.
	* @return        The index of the target cell’s row in the
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
	public int cellToRow(String cell) {
        int isCellValidRet = isCellValid(cell);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

	    return Integer.parseInt(cell.substring(1)); 
	}
	
	/**
	 * 
	 * @param  cell  The position of the cell on the board, from
	 * 				 values "A0" to "J9".
	 * 
	 * @return       The column of the cell on the board, from
	 * 				 characters A-J.
	 * 
	 *				 See Board documention
	 */
	public char cellToColChar(String cell) {
		return cell.charAt(0);
	}
	
	/**
	 * 
	 * @param  cell  The position of the cell on the board, from
	 * 				 values "A0" to "J9".
	 * @return       The row of the cell on the board, from
	 * 				 characters A-J.
	 *
	 *				 See Board documention
	 */
	public char cellToRowChar(String cell) {
		return cell.charAt(1);
	}

	
	/*
	----------------------
    Array Index Conversion
    ----------------------
    */
	
	
	
	/**
	* @param  col    The index of the target col’s row in the
	* 				 String[][] board.
	*
	* @return        The column of the cell on the board, from
	*				 characters A-J. See diagram at top of doc.
	*/
	public char colToColChar(int col) {
		return (char)(col + 'A');
	}
	
	
	
	/**
	* @param  row    The index of the target row’s row in the
	* 				 String[][] board.
	*
	* @return        The row of the cell on the board, from
	*				 characters 0-9. See diagram at top of doc.
	*/
	public char rowToRowChar(int row) {
		return Integer.toString(row).charAt(0);
	}
	
	
	
	/**
	* @param  col    The index of the target cell’s column in the
	* 				 String[][] board, retrieved through using
	* 				 cellToCol().
	* @param  row    The index of the target cell’s row in the
	* 				 String[][] board, retrieved through using
	* 				 cellToRow().
	* @return        The two-character position of the cell on the
	* 				 board, from values “A0” to “J9”, that
	* 				 corresponds to the passed row and column
	* 				 indices.
	*			 	 For example, colAndRowToCell(2, 4) returns “C4”
	*/
	public String colAndRowToCell(int col, int row) {
		return "" + colToColChar(col) + rowToRowChar(row);
	}

	
	/*
	----------------------
    Simple Cell Evaluation
    ----------------------
    */
	
	
	
	/**
	* @param  cell   The position of the cell on the board, from
	* 				 values “A0” to “J9”.
	* @param  board  The String[][] representation of the game
	* 				 board, comprised of ‘cells’, as described
	* 				 at the top of this doc.
	* 
	* @return        Returns TRUE if the given cell is storing a
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
	public int cellHasPiece(String cell, String[][] board) {
        int isCellValidRet = isCellValid(cell);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

		int col = cellToCol(cell);
		int row = cellToRow(cell);
		return cellHasPiece(col, row, board);
	}
	/**
	 * @param  col    The index of the target cell’s column in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToCol().
	 * @param  row    The index of the target cell’s row in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToRow().
	 * @param  board  The String[][] representation of the game
	 * 				 board, comprised of ‘cells’, as described
	 * 				 at the top of this doc.
	 *
	 * @return        Returns TRUE if the given cell is storing a
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
	public int cellHasPiece(int col, int row, String[][] board) {
        int isCellValidRet = isCellValid(col, row);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

		return !getCellValue(col, row, board).equals("") ? TRUE : FALSE;
	}
	
	
	
	/**
	* @param  cell   The position of the cell on the board, from
	* 				 values “A0” to “J9”.
	* @param  board  The String[][] representation of the game
	* 				 board, comprised of ‘cells’, as described
	* 				 at the top of this doc.
	* @param  myColor  The integer representing your color WHITE=0, BLACK=1
	* @return        Returns TRUE if the given cell is storing a
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
	public int isMyPiece(String cell, int myColor, String[][] board) {
        int isCellValidRet = isCellValid(cell);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

		int col = cellToCol(cell);
		int row = cellToRow(cell);
		return isMyPiece(col, row, myColor, board);
	}
	/**
	 * @param  col    The index of the target cell’s column in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToCol().
	 * @param  row    The index of the target cell’s row in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToRow().
	 * @param  board  The String[][] representation of the game
	 * 				 board, comprised of ‘cells’, as described
	 * 				 at the top of this doc.
	 * @param  myColor  The integer representing your color WHITE=0, BLACK=1
	 * @return        Returns TRUE if the given cell is storing a
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
	public int isMyPiece(int col, int row, int myColor, String[][] board) {
		int isCellValidRet = isCellValid(col, row);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

		return getPieceColor(col, row, board) == myColor ? TRUE : FALSE;
	}
	
	/**
	* @param  cell   The position of the cell on the board, from
	* 				 values “A0” to “J9”.
	* @param  board  The String[][] representation of the game
	* 				 board, comprised of ‘cells’, as described
	* 				 at the top of this doc.
	* @return        An integer representing the color/owner of the
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
	public int getPieceColor(String cell, String[][] board) {
        int isCellValidRet = isCellValid(cell);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        
		return getPieceColor(cellToCol(cell), cellToRow(cell), board);
	}
	/**
	 * @param  col    The index of the target cell’s column in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToCol().
	 * @param  row    The index of the target cell’s row in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToRow().
	 * @param  board  The String[][] representation of the game
	 * 				 board, comprised of ‘cells’, as described
	 * 				 at the top of this doc.
	 * @return        An integer representing the color/owner of the
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
	public int getPieceColor(int col, int row, String[][] board) {
        int isCellValidRet = isCellValid(col, row);
        if (isCellValidRet != TRUE)
            return isCellValidRet;
        
		if (cellHasPiece(col, row, board) == FALSE)
			return NO_PIECE;
		
		String cellVal = getCellValue(col, row, board);
		char colorChar = cellVal.charAt(0);

		return switch (colorChar) {
			case WHITE_CHAR -> WHITE;
			case BLACK_CHAR -> BLACK;
			default -> NO_PIECE;
		};
	}

	/**
	* @param  cell   The position of the cell on the board, from
	* 				 values “A0” to “J9”.
	* @param  board  The String[][] representation of the game
	* 				 board, comprised of ‘cells’, as described
	* 				 at the top of this doc.
	* @return        An integer representing the color/owner of the
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
	public int getPieceMoveDistance(String cell, String[][] board) {
        int isCellValidRet = isCellValid(cell);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

		int col = cellToCol(cell);
		int row = cellToRow(cell);
		return getPieceMoveDistance(col, row, board);
	}
	/**
	 * @param  col    The index of the target cell’s column in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToCol().
	 * @param  row    The index of the target cell’s row in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToRow().
	 * @param  board  The String[][] representation of the game
	 * 				 board, comprised of ‘cells’, as described
	 * 				 at the top of this doc.
	 * @return        An integer representing the color/owner of the
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
	public int getPieceMoveDistance(int col, int row, String[][] board) {
		int isCellValidRet = isCellValid(col, row);
        if (isCellValidRet != TRUE)
            return isCellValidRet;

		if (cellHasPiece(col, row, board) == FALSE)
			return 0;
		
		String cellVal = getCellValue(col, row, board);
		return Integer.parseInt(cellVal.substring(1));
	}
	
	
	/*
	--------------------
      Strategy Helpers
    --------------------
    */
	
	/**
	 * 
	 * @param color  An integer representing the color of 
	 * 				 the current player.
	 * @param board  The String[][] representation of the game
	 * 				 board, comprised of 'cells', as described
	 * 				 at the top of this doc.
	 * @return		 An array of cells that pieces of the specified
	 * 				 color are in.  The array is of fixed length 20,
	 * 				 with empty array entries having the value "".
	 */
	public String[] getMyPieceLocations(int color, String[][] board) {
		String[] locations = new String[NUM_PIECES_PER_SIDE];
		for (int i = 0; i < NUM_PIECES_PER_SIDE; i++)
			locations[i] = "";
		
		int curArrIndex = 0;
		
		for (int i = 0; i < BOARD_LENGTH; i++) {
			for (int j = 0; j < BOARD_LENGTH; j++) {
				if (isMyPiece(i, j, color, board) == TRUE) {
					locations[curArrIndex] = colAndRowToCell(i, j);
					curArrIndex++;
				}
			}
		}
		
		return locations;
	}
	
	/**
	* @param  cell   The position of the cell on the board, from
	* 				 values “A0” to “J9”.
	* @param  myColor  The integer representing your color WHITE=0, BLACK=1
	* @param  board  The String[][] representation of the game
	* 				 board, comprised of ‘cells’, as described
	* 				 at the top of this doc.
	* @return        An array of all cell positions that the piece
	* 				 in the current cell can move to, represented
	* 				 like [“E7”, “G7”, “E6”, “H8”].  If the owner of
	*/
	public String[] getValidMoves(String cell, int myColor, String[][] board) {
		int row = cellToRow(cell);
		int col = cellToCol(cell);
		
		return getValidMoves(col, row, myColor, board);
	}
	/**
	 * @param  col    The index of the target cell’s column in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToCol().
	 * @param  row    The index of the target cell’s row in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToRow().
	 * @param  myColor  The integer representing your color WHITE=0, BLACK=1
	 * @param  board  The String[][] representation of the game
	 * 				 board, comprised of ‘cells’, as described
	 * 				 at the top of this doc.
	 * @return        An array of all cell positions that the piece
	 * 				 in the current cell can move to, represented
	 * 				 like [“E7”, “G7”, “E6”, “H8”].  If the owner of
	 */
	public String[] getValidMoves(int col, int row, int myColor, String[][] board) {
		String[] moves = new String[VALID_MOVES_ARRAY_LENGTH];
		
		for (int i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {
			moves[i] = "";
		}

		int currentArrayIndex = 0;
		int moveDistance = getPieceMoveDistance(col, row, board);
		
		if (moveDistance <= 0)
			return moves;
		
		for (int i = -moveDistance; i <= moveDistance; i += moveDistance) {			//William, you almost got it right. I just need to change two places in the code, i++ and j++
			for (int j = -moveDistance; j <= moveDistance; j += moveDistance) {		//to i += moveDistance and j += moveDistance ! Plus corresponding code in SimulationApp
				int newCol = col + i;
				int newRow = row + j;

				if ((isCellValid(newCol, newRow) == TRUE)
					&& isMyPiece(newCol, newRow, myColor, board) != TRUE) {
                    int pieceColor = getPieceColor(col, row, board);
                    /*if (isPlayerInCheck(pieceColor, board) == TRUE && ((pieceColor == WHITE && row != 0) || (pieceColor == BLACK && row != 9)))
                        continue;*/
					if (isPlayerInCheck(pieceColor, board) == TRUE) {
						int columnInCheck = whichColumnIsPlayerInCheck(pieceColor, board);
						int rowToCheck = (pieceColor == WHITE) ? 9 : 0;
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

	public String[] getValidMovesCheckMateIncluded(String cell, int myColor, String[][] board) {
		int row = cellToRow(cell);
		int col = cellToCol(cell);

		String[] moves = new String[VALID_MOVES_ARRAY_LENGTH];

		for (int i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {
			moves[i] = "";
		}

		int currentArrayIndex = 0;
		int moveDistance = getPieceMoveDistance(col, row, board);

		if (moveDistance <= 0)
			return moves;

		for (int i = -moveDistance; i <= moveDistance; i += moveDistance) {
			for (int j = -moveDistance; j <= moveDistance; j += moveDistance) {
				int newCol = col + i;
				int newRow = row + j;

				if ((isCellValid(newCol, newRow) == TRUE)
						&& isMyPiece(newCol, newRow, myColor, board) != TRUE) {
					int pieceColor = getPieceColor(col, row, board);
                    /*if (isPlayerInCheck(pieceColor, board) == TRUE && ((pieceColor == WHITE && row != 0) || (pieceColor == BLACK && row != 9)))
                        continue;*/
					/*if (isPlayerInCheck(pieceColor, board) == TRUE) {
						int columnInCheck = whichColumnIsPlayerInCheck(pieceColor, board);
						int rowToCheck = (pieceColor == WHITE) ? 9 : 0;
						if (newCol != columnInCheck || newRow != rowToCheck)
							continue;
					}*/
					moves[currentArrayIndex] = colAndRowToCell(newCol, newRow);
					currentArrayIndex++;
				}
			}
		}

		return moves;
	}

	
	
	/**
	* @param  color  An integer representing the color of
	* 			     the current player.
	* 			     0 = WHITE  and  1 = BLACK
	* @param  board  The String[][] representation of the game
	  				 board, comprised of ‘cells’, as described
	  				 at the top of this doc.
	
	* @return        Returns TRUE if the given player’s opponent has
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
	public int isPlayerInCheck(int color, String[][] board) {
		int rowToCheck;
		
		if (color == WHITE)
			rowToCheck = 9;
		else if (color == BLACK)
			rowToCheck = 0;
		else
			return ERR_INVALID_COLOR;
		
		for (int i = 0; i < BOARD_LENGTH; i++) {
			if ((getPieceColor(i, rowToCheck, board) == getOpponentColor(color))
				&& (getPieceMoveDistance(i, rowToCheck, board) == 1))
				return TRUE;
		}
		
		return FALSE;
	}

	/**
	 * @param  color  An integer representing the color of
	 * 			     the current player.
	 * 			     0 = WHITE  and  1 = BLACK
	 * @param  board  The String[][] representation of the game
	board, comprised of ‘cells’, as described
	at the top of this doc.

	 * @return        Assumes the given player’s opponent has
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

	public int whichColumnIsPlayerInCheck(int color, String[][] board) {
		int rowToCheck;

		if (color == WHITE)
			rowToCheck = 9;
		else if (color == BLACK)
			rowToCheck = 0;
		else
			return ERR_INVALID_COLOR;

		for (int i = 0; i < BOARD_LENGTH; i++) {
			if ((getPieceColor(i, rowToCheck, board) == getOpponentColor(color))
					&& (getPieceMoveDistance(i, rowToCheck, board) == 1))
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
	* @param  moveString  A string representation of a move of
	* 					  piece from one cell to another cell, in the
	* 					  format: “<cellFrom>, <cellTo>”.  ‘cellFrom’
	* 					  refers to the cell that a piece starts in, and
	* 					  ‘cellTo’ refers to the cell that the piece will
	* 					  land in.
	* 					  For example, “A2, B2” is moving the piece
	* 					  currently in cell A2 to cell B2.
	* @param  myColor  The integer representing your color WHITE=0, BLACK=1
	* @param  board  The String[][] representation of the game
	* 				 board, comprised of ‘cells’, as described
	* 				 at the top of this doc.
	* @return        Returns TRUE if the passed move is valid.
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
	public int isMoveValid(String moveString, int myColor, String[][] board) {
		String[] moveCells = moveString.split(", ");
		
		if (moveCells.length != 2)
			return ERR_FORMAT;
		
		String fromCell = moveCells[0];
		String toCell = moveCells[1];
		
		return isMoveValid(fromCell, toCell, myColor, board);
	}
	/**
	 * @param  fromCell   A string representation of the cell that
	 * 					  a piece starts in, with values "A0"-"J9".
	 * @param  toCell   A string representation of the cell that
	 * 					  a piece will land in, with values "A0"-"J9".
	 * @param  myColor  The integer representing your color WHITE=0, BLACK=1
	 * @param  board  The String[][] representation of the game
	 * 				 board, comprised of ‘cells’, as described
	 * 				 at the top of this doc.
	 * @return        Returns TRUE if the passed move is valid.
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
	public int isMoveValid(String fromCell, String toCell, int myColor, String[][] board) {
		if (fromCell == null || toCell == null || fromCell.length() != 2 || toCell.length() != 2)
			return ERR_FORMAT;
		
        int cellValidRet = isCellValid(fromCell);
		if (cellValidRet != TRUE)
            return ERR_FORMAT_MOVE_FROM;
		
        cellValidRet = isCellValid(toCell);
		if (cellValidRet != TRUE)
            return ERR_FORMAT_MOVE_TO;
		
		int pieceMoveDistance = getPieceMoveDistance(fromCell, board);
		
		if (pieceMoveDistance == 0 || isMyPiece(fromCell, myColor, board) != TRUE || isMyPiece(toCell, myColor, board) == TRUE)
			return FALSE;
		
		if ((Math.abs(cellToRow(fromCell) - cellToRow(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance)
			 || (Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance))
			return FALSE;
		
		return TRUE;
	}
	
	/**
	* @param  cell   The position of the cell on the board, from
	* 				 values “A0” to “J9”.
	* @return        Returns TRUE, a positive integer, if the passed
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
	public int isCellValid(String cell) {
		if (cell == null || cell.length() != 2)
			return ERR_FORMAT;
		
		char colChar = cell.charAt(0);
		char rowChar = cell.charAt(1);
		
		if (colChar < 'A' || colChar > 'J')
			return ERR_INVALID_COL;
		
		if (rowChar < '0' || rowChar > '9')
			return ERR_INVALID_ROW;
		
		return TRUE;
	}
	/**
	 * @param  col    The index of the target cell’s column in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToCol().
	 * @param  row    The index of the target cell’s row in the
	 * 				 String[][] board, retrieved through using
	 * 				 cellToRow().
	 * @return        Returns TRUE, a positive integer, if the passed
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
    public int isCellValid(int col, int row) {
        if (col < 0 || col > 9)
            return ERR_INVALID_COL;
        if (row < 0 || row > 9)
            return ERR_INVALID_ROW;

        return TRUE;
    }
}