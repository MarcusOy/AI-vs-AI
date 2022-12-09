function getMove() {
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
    var moves = new Array();

    // Iterate through every piece I have
    for (var i = 0; i < pieceLocations.length; i++) {
        var piece = pieceLocations[i];

        // Iterates through all valid moves that my pieces have, adding
        // each valid move to the moves Array.
        //
        // These valid moves are stored in a fixed-size Array whose
        // elements are never null, but instead are "" when empty.
        var validMoves = getValidMoves(piece, getMyColor(), null);
        for (var j = 0; j < validMoves.length; j++) {
            var move = validMoves[j];

            // Adds the current move to the moves Array
            moves.push(piece + ", " + move);
        }
    }

    //if you have no legal moves, that means you are checkmated
    if (moves.length === 0) {
        // Since you are about to lose, it is ok to return an invalid
        //    move string here, like "CHECKMATED"
        return "CHECKMATED";
    }

    // chooses a random move from the valid moves Array
    return moves[Math.floor((Math.random() * moves.length))];
}