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
}