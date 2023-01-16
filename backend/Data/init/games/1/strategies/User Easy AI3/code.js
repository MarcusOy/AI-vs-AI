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
        case 5:     //here is where we take advantage of switch fallthrough (in 5 second cond isn't necessary, just for consistency)
            if (getMyColor() === 0) {    //we are playing white
                if (getCellValue(1, 9) === "w3") {
                    return "B9, E9"; //move the LEFT 3
                }
            } else {                               //we are playing black
                if (getCellValue(8, 0) === "b3") {
                    return "I0, F0"; //move the LEFT 3
                }
            }
        case 6:
            if (getMyColor() === 0) {    //we are playing white
                if (getCellValue(8, 9) === "w3") {
                    return "I9, F9"; //move the RIGHT 3
                }
            } else {                               //we are playing black
                if (getCellValue(1, 0) === "b3") {
                    return "B0, E0"; //move the RIGHT 3
                }
            }
        case 7:
            if (getMyColor() === 0) {    //we are playing white
                if (getCellValue(3, 9) === "w1") {
                    return "D9, C9"; //move the 1 blocking the OUTER 3
                }
            } else {                               //we are playing black
                if (getCellValue(6, 0) === "b1") {
                    return "G0, H0"; //move the 1 blocking the OUTER 3
                }
            }
        case 8:
            if (getMyColor() === 0) {    //we are playing white
                if (getCellValue(0, 9) === "w3") {
                    return "A9, D9"; //move the OUTER 3
                }
            } else {                               //we are playing black
                if (getCellValue(9, 0) === "b3") {
                    return "J0, G0"; //move the OUTER 3
                }
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
                    if (piece === 4 || piece === 3) {                   //do not move pieces that are part of the formation
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