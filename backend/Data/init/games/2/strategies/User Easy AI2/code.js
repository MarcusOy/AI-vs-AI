function getMove() {
    var board = getBoard();
    var pieceLocations = getMyPieceLocations(getMyColor());

    switch (gameState.numMovesMade / 2 + 1) {
        case 1:
            if (getMyColor() === 0) {    //we are playing white
                return "C9, E7"; //move the LEFT 2
            } else {                               //we are playing black
                return "H0, F2"; //move the LEFT 2
            }
        case 2:
            if (getMyColor() === 0) {    //we are playing white
                return "H9, F7"; //move the RIGHT 2
            } else {                               //we are playing black
                return "C0, E2"; //move the RIGHT 2
            }
        case 3:
            if (getMyColor() === 0) {    //we are playing white
                return "E9, E5"; //move the LEFT 4
            } else {                               //we are playing black
                return "F0, F4"; //move the LEFT 4
            }
        case 4:
            if (getMyColor() === 0) {    //we are playing white
                return "F9, F5"; //move the RIGHT 4
            } else {                               //we are playing black
                return "E0, E4"; //move the RIGHT 4
            }
        default:
            if (isPlayerInCheck(getMyColor()) === TRUE) {        // Capture the opponent’s 1
                moves = new Array();
                for (var i = 0; i < pieceLocations.length; i++) {
                    var location = pieceLocations[i];

                    var validMoves = getValidMoves(location, getMyColor(), null);
                    for (var j = 0; j < validMoves.length; j++) {
                        var move = validMoves[j];

                        moves.push(location + ", " + move);
                    }
                }
                if (moves.length === 0) {                //if you have no legal moves, that means you are checkmated
                    return "CHECKMATED";
                }
                return moves[Math.floor(Math.random() * moves.length)];
            } else {
                moves = new Array();
                for (var i = 0; i < pieceLocations.length; i++) {
                    var location = pieceLocations[i];

                    var piece = getPieceMoveDistance(location);
                    if (piece === 4) {                   //do not move pieces that are part of the formation
                        continue;
                    }
                    if (piece === 2 && cellToRow(location) % 2 !== getMyColor()) {   //neat way to check which parity of 2s
                        continue;
                    }

                    var validMoves = getValidMoves(location, getMyColor());
                    for (var j = 0; j < validMoves.length; j++) {
                        var move = validMoves[j];

                        moves.push(location + ", " + move);
                    }
                }
                if (moves.length === 0) {                //if you have no legal moves, that means you are checkmated
                    return moves + "     " + pieceLocations + "     " + moves.length + "  " + "CHECKMATED";
                }
                return moves[Math.floor(Math.random() * moves.length)];
            }
    }
}            