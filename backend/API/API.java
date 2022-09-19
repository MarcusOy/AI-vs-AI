public class API {
	// cell values are NEVER null - they should be "" if empty

	final int NUM_PIECES_PER_SIDE = 20;
	final int BOARD_LENGTH = 10;
	
	final int MIN_MOVE_DISTANCE = 1;
	final int MAX_MOVE_DISTANCE = 4;
	
	final char WHITE_CHAR = 'w';
	final char BLACK_CHAR = 'b';
	
	final int VALID_MOVES_ARRAY_LENGTH = 80;
	// 10x10 board, B,W colors,  
	
	final int TRUE = 1;
	final int FALSE = 0;
	
	final int WHITE = 0;
	final int BLACK = 1;
	final int NO_PIECE = -1;
	
	final int ERR_INVALID_COLOR = -7;


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
	String[][] getBoard(/*GameState*/String gameState) {
		//TODO actually implement
		return new String[10][10]; // temporary
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
	int getMyColor(/*GameState gameState*/) {
		//TODO actually implement
		return 0; // temporary
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
	* 				 	 the not current player.
	* 				 	 0 = WHITE  and  1 = BLACK
	*/
	int getOpponentColor(/*GameState gameState*/) {
		//TODO actually implement
		return 1; // temporary
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
	* @param  col    The index of the target cell’s column in the
	*				 String[][] board, retrieved through using
	*				 cellToCol().
	* @param  row    The index of the target cell’s row in the
	*				 String[][] board, retrieved through using
	*				 cellToRow().
	*
	* @return        The two-character representation of a ‘cell’,
	*			  	 with “” being an empty cell with no piece, and
	*			  	 “b1” representing one the black-side player’s
	*			  	 1 pieces.
	*/
	String getCellValue(String cell, String[][] board) {
		String foundVal = getCellValue(cellToCol(cell), cellToRow(cell), board);
		
		if (foundVal == null || foundVal.length() != 2)
			return "";
		
		return foundVal;
	}
	String getCellValue(int col, int row, String[][] board) {
		return board[row][col];
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
	*/
	int cellToCol(String cell) {
		//TODO add error checking to javadoc and code
	    char colChar = cellToColChar(cell);
	    int colNum = colChar - 'a';
	    return colNum;
	}
		
	
	
	/**
	* @param  cell   The position of the cell on the board, from
	* 				 values “A0” to “J9”.
	* @return        The index of the target cell’s row in the
	*				 String[][] board.
	*/
	int cellToRow(String cell) {
		//TODO add error checking to javadoc and code
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
	 * @see			 Board documention
	 */
	char cellToColChar(String cell) {
		return cell.charAt(0);
	}
	
	/**
	 * 
	 * @param  cell  The position of the cell on the board, from
	 * 				 values "A0" to "J9".
	 * @return       The row of the cell on the board, from
	 * 				 characters A-J.
	 * 
	 * @see			 Board documentation.
	 */
	char cellToRowChar(String cell) {
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
	char colToColChar(int col) {
		return (char)(col + 'a');
	}
	
	
	
	/**
	* @param  row    The index of the target row’s row in the
	* 				 String[][] board.
	*
	* @return        The row of the cell on the board, from
	*				 characters 0-9. See diagram at top of doc.
	*/
	char rowToRowChar(int row) {
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
	String colAndRowToCell(int col, int row) {
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
	* @param  col    The index of the target cell’s column in the
	* 				 String[][] board, retrieved through using
	* 				 cellToCol().
	* @param  row    The index of the target cell’s row in the
	* 				 String[][] board, retrieved through using
	* 				 cellToRow().
	* 
	* @return        Returns TRUE if the given cell is storing a
	* 				 string representing a piece, like “b3” or “w1”.
	* 				 False if the cell is storing “”.
	* 				 Returns a negative integer if an error
	* 				 occurs.
	* 
	* @error         Returns ERR_INVALID_COL if the passed move’s
	* 				 column is an invalid character.
	*                Returns ERR_INVALID_ROW if the passed move’s
	* 				 row is an invalid character.
	* 				 Returns ERR_FORMAT if the passed move is
	* 				 otherwise improperly formatted.
	*/
	boolean cellHasPiece(String cell, String[][] board) {
		int col = cellToCol(cell);
		int row = cellToRow(cell);
		return cellHasPiece(col, row, board);
	}
	boolean cellHasPiece(int col, int row, String[][] board) {
		//TODO convert to int return type
		//TODO add error checking to code
		return !getCellValue(col, row, board).equals("");
	}
	
	
	
	/**
	* @param  cell   The position of the cell on the board, from
	* 				 values “A0” to “J9”.
	* @param  board  The String[][] representation of the game
	* 				 board, comprised of ‘cells’, as described
	* 				 at the top of this doc.
	* @param  col    The index of the target cell’s column in the
	* 				 String[][] board, retrieved through using
	* 				 cellToCol().
	* @param  row    The index of the target cell’s row in the
	* 				 String[][] board, retrieved through using
	* 				 cellToRow().
	* @return        Returns TRUE if the given cell is storing a
	* 				 string representing a piece of yours.  I.e.
	* 				 “b3” if you are on black-side.
	* 				 Returns FALSE if the above condition isn’t met.
	* 				 Returns a negative integer if an error
	* 				 occurs.
	* @error         Returns ERR_INVALID_CELL if the string
	*				 representing the fromCell is invalid.
	*/
	boolean isMyPiece(String cell, String[][] board) {
		int col = cellToCol(cell);
		int row = cellToRow(cell);
		return isMyPiece(col, row, board);
	}
	boolean isMyPiece(int col, int row, String[][] board) {
		//TODO convert to int return type
		//TODO add error checking to code
		return getPieceColor(col, row, board) == getMyColor();
	}
	
	/**
	* @param  cell   The position of the cell on the board, from
	  				 values “A0” to “J9”.
	* @param  board  The String[][] representation of the game
	  				 board, comprised of ‘cells’, as described
	  				 at the top of this doc.
	* @param  col    The index of the target cell’s column in the
	  				 String[][] board, retrieved through using
	  				 cellToCol().
	* @param  row    The index of the target cell’s row in the
	  				 String[][] board, retrieved through using
	  				 cellToRow().
	* @return        An integer representing the color/owner of the
	  				 piece.  0 = WHITE, 1 = BLACK, and -1 = NO_PIECE
	*/
	int getPieceColor(String cell, String[][] board) {		
		return getPieceColor(cellToCol(cell), cellToRow(cell), board);
	}
	int getPieceColor(int col, int row, String[][] board) {	
		//TODO add error checking to javadoc and code
		if (!cellHasPiece(col, row, board))
			return NO_PIECE;
		
		String cellVal = getCellValue(col, row, board);
		char colorChar = cellVal.charAt(0);
		
		switch (colorChar) {
			case WHITE_CHAR:
				return WHITE;
			case BLACK_CHAR:
				return BLACK;
			default:
				return NO_PIECE;
		}
	}

	/**
	* @param  cell   The position of the cell on the board, from
	  				 values “A0” to “J9”.
	* @param  board  The String[][] representation of the game
	  				 board, comprised of ‘cells’, as described
	  				 at the top of this doc.
	* @param  col    The index of the target cell’s column in the
	  				 String[][] board, retrieved through using
	  				 cellToCol().
	* @param  row    The index of the target cell’s row in the
	  				 String[][] board, retrieved through using
	  				 cellToRow().
	* @return        An integer representing the color/owner of the
	  				 piece.  0 = WHITE, 1 = BLACK, and -1 = NO_PIECE
	*/
	int getPieceMoveDistance(String cell, String[][] board) {
		int col = cellToCol(cell);
		int row = cellToRow(cell);
		return getPieceMoveDistance(col, row, board);
	}
	int getPieceMoveDistance(int col, int row, String[][] board) {
		//TODO add error checking to javadoc and code
		if (!cellHasPiece(col, row, board))
			return 0;
		
		String cellVal = getCellValue(col, row, board);
		return Integer.parseInt(cellVal.substring(1));
	}
	
	
	/*
	--------------------
      Strategy Helpers
    --------------------
    */
	
	
	String[] getMyPieceLocations(int color, String[][] board) {
		String[] locations = new String[NUM_PIECES_PER_SIDE];
		for (int i = 0; i < NUM_PIECES_PER_SIDE; i++)
			locations[i] = "";
		
		int curArrIndex = 0;
		
		for (int i = 0; i < BOARD_LENGTH; i++) {
			for (int j = 0; j < BOARD_LENGTH; j++) {
				if (isMyPiece(i, j, board)) {
					locations[curArrIndex] = colAndRowToCell(i, j);
					curArrIndex++;
				}
			}
		}
		
		return locations;
	}
	
	
	
	/**
	* @param  cell   The position of the cell on the board, from
	  				 values “A0” to “J9”.

	* @param  allowSelfCapture   Whether or not you want to include
	    						 moves in which one of your pieces
	    						 lands on top of another one of your
	    						 pieces, thus causing a capture of
	    						 your own piece(s).
	* @param  board  The String[][] representation of the game
	  				 board, comprised of ‘cells’, as described
	  				 at the top of this doc.
	* @param  col    The index of the target cell’s column in the
	  				 String[][] board, retrieved through using
	  				 cellToCol().
	* @param  row    The index of the target cell’s row in the
	  				 String[][] board, retrieved through using
	  				 cellToRow().
	* @return        An array of all cell positions that the piece
	  				 in the current cell can move to, represented
	  				 like [“E7”, “G7”, “E6”, “H8”].  If the owner of
	*/
	String[] getValidMoves(String cell, boolean allowSelfCapture, String[][] board) {
		int row = cellToRow(cell);
		int col = cellToCol(cell);
		
		return getValidMoves(col, row, allowSelfCapture, board);
	}
	String[] getValidMoves(int col, int row, boolean allowSelfCapture, String[][] board) {
		//TODO restrict valid moves when in check
		
		String[] moves = new String[VALID_MOVES_ARRAY_LENGTH];
		
		for (int i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {
			moves[i] = "";
		}

		int currentArrayIndex = 0;
		int moveDistance = getPieceMoveDistance(col, row, board);
		
		if (moveDistance <= 0)
			return moves;
		
		for (int i = -moveDistance; i <= moveDistance; i++) {
			for (int j = -moveDistance; j <= moveDistance; j++) {
				int newCol = col + i;
				int newRow = row + j;
				
				if (isCellValid(colAndRowToCell(newCol, newRow))
					&& (allowSelfCapture || !isMyPiece(newCol, newRow, board))) {
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
	
	* @error         Returns ERR_INVALID_COLOR if the passed color
	  				 is not WHITE or BLACK.
	*/
	int isPlayerInCheck(int color, String[][] board) {
		int rowToCheck;
		
		if (color == WHITE)
			rowToCheck = 0;
		else if (color == BLACK)
			rowToCheck = 9;
		else
			return ERR_INVALID_COLOR;
		
		for (int i = 0; i < BOARD_LENGTH; i++) {
			if ((getPieceColor(i, rowToCheck, board) == getOpponentColor())
				&& (getPieceMoveDistance(i, rowToCheck, board) == 1))
				return TRUE;
		}
		
		return FALSE;
	}
	
	
	/*
	--------------------
         Validation
    --------------------
    */
	
	
	
	/**
	* @param  moveString  A string representation of a move of
	  					  piece from one cell to another cell, in the
	  					  format: “<cellFrom>, <cellTo>”.  ‘cellFrom’
	  					  refers to the cell that a piece starts in, and
	  					  ‘cellTo’ refers to the cell that the piece will
	  					  land in.
	  					  For example, “A2, B2” is moving the piece
	  					  currently in cell A2 to cell B2.
	* @param  board  The String[][] representation of the game
	  				 board, comprised of ‘cells’, as described
	  				 at the top of this doc.
	* @return        Returns TRUE if the passed move is valid.
				  	 Returns FALSE if the passed move is properly
	  				 formatted, but invalid.
	  				 Returns a negative integer if an error
	  				 occurs.
	* @error         Returns ERR_FORMAT_MOVE_FROM if the string
	  				 representing the fromCell is invalid.
	  				 Returns ERR_FORMAT_MOVE_TO if the string
	  				 representing the toCell is invalid.
	  				 otherwise improperly formatted.
	  				 Returns ERR_FORMAT if the passed move is
	  				 otherwise improperly formatted.
	*/
	boolean isMoveValid(String moveString, String[][] board) {
		//TODO convert to int return type
		//TODO add error checking to code
		String[] moveCells = moveString.split(", ");
		
		if (moveCells.length != 2)
			return false;
		
		String fromCell = moveCells[0];
		String toCell = moveCells[1];
		
		return isMoveValid(fromCell, toCell, board);
	}	
	boolean isMoveValid(String fromCell, String toCell, String[][] board) {
		//TODO convert to int return type
		//TODO add error checking to code
		if (fromCell == null || toCell == null || fromCell.length() != 2 || toCell.length() != 2)
			return false;
		
		if (!isCellValid(fromCell))
			return false;
		
		if (!isCellValid(toCell))
			return false;
		
		int pieceMoveDistance = getPieceMoveDistance(fromCell, board);
		
		if (!isMyPiece(fromCell, board) || pieceMoveDistance == 0)
			return false;
		
		if ((Math.abs(cellToRow(fromCell) - cellToRow(toCell)) > pieceMoveDistance)
			 || (Math.abs(cellToCol(fromCell) - cellToCol(toCell)) > pieceMoveDistance))
			return false;
		
		return true;
	}
	
	/**
	* @param  cell   The position of the cell on the board, from
	  				 values “A0” to “J9”.
	* @return        Returns TRUE, a positive integer, if the passed
	  				 cell is valid.
	  				 Returns a negative integer if it’s invalid,
	  				 causing an error.
	* @error         Returns ERR_INVALID_COL if the passed move’s
	  				 column is an invalid character.
	                 Returns ERR_INVALID_ROW if the passed move’s
	  				 row is an invalid character.
	  				 Returns ERR_FORMAT if the passed move is
	  				 otherwise improperly formatted.
	*/
	boolean isCellValid(String cell) {
		//TODO convert to int return type
		//TODO add error checking to code
		if (cell == null || cell.length() != 2)
			return false;
		
		char colChar = cellToColChar(cell);
		char rowChar = cellToRowChar(cell);
		
		if (colChar < 'A' || colChar > 'J')
			return false;
		
		if (rowChar < 0 || rowChar > 9)
			return false;
		
		return true;
	}
}