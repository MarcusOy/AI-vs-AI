function getMove() {
    if (getMyColor() === 0) {    //we are playing white
        if (getCellValue(0, 9) === "w3") {
            return "A9, D6";
        } else if (getCellValue(3, 6) === "w3") {
            return "D6, A3";
        } else if (getCellValue(0, 3) === "w3") {
            return "A3, D0";
        } else if (getCellValue(3, 0) === "w3") {
            return "D0, G0";
        } else if (getCellValue(4, 9) === "w4") {
            return "E9, E5";
        } else if (getCellValue(4, 5) === "w4") {
            return "E5, E1";
        } else if (getCellValue(4, 1) === "w4") {
            return "E1, I1";
        } else if (getCellValue(5, 9) === "w4") {
            return "F9, F5";
        } else if (getCellValue(5, 5) === "w4") {
            return "F5, F1";
        } else if (getCellValue(5, 1) === "w4") {
            return "F1, B1";
        } else if (getCellValue(0, 8) === "w1") {
            return "A8, B7";
        } else if (getCellValue(1, 7) === "w1") {
            return "B7, C6";
        } else if (getCellValue(2, 6) === "w1") {
            return "C6, D5";
        } else if (getCellValue(3, 5) === "w1") {
            return "D5, D4";
        } else if (getCellValue(3, 4) === "w1") {
            return "D4, D3";
        } else if (getCellValue(3, 3) === "w1") {
            return "D3, D2";
        } else if (getCellValue(3, 2) === "w1") {
            return "D2, E1";
        } else if (getCellValue(4, 1) === "w1") {
            return "E1, D0";
        } else if (getCellValue(4, 8) === "w1") {
            return "E8, E7";
        } else if (getCellValue(4, 7) === "w1") {
            return "E7, E6";
        } else if (getCellValue(4, 6) === "w1") {
            return "E6, D5";
        } else if (getCellValue(3, 5) === "w1") {
            return "D5, D4";
        } else if (getCellValue(3, 4) === "w1") {
            return "D4, D3";
        } else if (getCellValue(3, 3) === "w1") {
            return "D3, D2";
        } else if (getCellValue(3, 2) === "w1") {
            return "D2, E1";
        } else if (getCellValue(4, 1) === "w1") {
            return "E1, D0";
        } else if (getCellValue(5, 8) === "w1") {
            return "F8, F7";
        } else if (getCellValue(5, 7) === "w1") {
            return "F7, E6";
        } else if (getCellValue(4, 6) === "w1") {
            return "E6, D5";
        } else if (getCellValue(3, 5) === "w1") {
            return "D5, D4";
        } else if (getCellValue(3, 4) === "w1") {
            return "D4, D3";
        } else if (getCellValue(3, 3) === "w1") {
            return "D3, D2";
        } else if (getCellValue(3, 2) === "w1") {
            return "D2, E1";
        } else if (getCellValue(4, 1) === "w1") {
            return "E1, D0";
        } else if (getCellValue(3, 8) === "w1") {
            return "D8, E7";
        } else if (getCellValue(4, 7) === "w1") {
            return "E7, E6";
        } else if (getCellValue(4, 6) === "w1") {
            return "E6, D5";
        } else if (getCellValue(3, 5) === "w1") {
            return "D5, D4";
        } else if (getCellValue(3, 4) === "w1") {
            return "D4, D3";
        } else if (getCellValue(3, 3) === "w1") {
            return "D3, D2";
        } else if (getCellValue(3, 2) === "w1") {
            return "D2, E1";
        } else if (getCellValue(4, 1) === "w1") {
            return "E1, D0";
        } else if (getCellValue(6, 8) === "w1") {
            return "G8, F7";
        } else if (getCellValue(5, 7) === "w1") {
            return "F7, E6";
        } else if (getCellValue(4, 6) === "w1") {
            return "E6, D5";
        } else if (getCellValue(3, 5) === "w1") {
            return "D5, D4";
        } else if (getCellValue(3, 4) === "w1") {
            return "D4, D3";
        } else if (getCellValue(3, 3) === "w1") {
            return "D3, D2";
        } else if (getCellValue(3, 2) === "w1") {
            return "D2, E1";
        } else if (getCellValue(4, 1) === "w1") {
            return "E1, D0";
        } else if (getCellValue(3, 9) === "w1") {
            return "D9, D8";
        } else if (getCellValue(3, 8) === "w1") {
            return "D8, E7";
        } else if (getCellValue(4, 7) === "w1") {
            return "E7, E6";
        } else if (getCellValue(4, 6) === "w1") {
            return "E6, D5";
        } else if (getCellValue(3, 5) === "w1") {
            return "D5, D4";
        } else if (getCellValue(3, 4) === "w1") {
            return "D4, D3";
        } else if (getCellValue(3, 3) === "w1") {
            return "D3, D2";
        } else if (getCellValue(3, 2) === "w1") {
            return "D2, E1";
        } else if (getCellValue(4, 1) === "w1") {
            return "E1, D0";
        } else if (getCellValue(6, 9) === "w1") {
            return "G9, G8";
        } else if (getCellValue(6, 8) === "w1") {
            return "G8, F7";
        } else if (getCellValue(5, 7) === "w1") {
            return "F7, E6";
        } else if (getCellValue(4, 6) === "w1") {
            return "E6, D5";
        } else if (getCellValue(3, 5) === "w1") {
            return "D5, D4";
        } else if (getCellValue(3, 4) === "w1") {
            return "D4, D3";
        } else if (getCellValue(3, 3) === "w1") {
            return "D3, D2";
        } else if (getCellValue(3, 2) === "w1") {
            return "D2, E1";
        } else if (getCellValue(4, 1) === "w1") {
            return "E1, D0";
        }
    } else {                            //we are playing black
        if (getCellValue(9, 0) === "b3") {
            return "J0, G3";
        } else if (getCellValue(6, 3) === "b3") {
            return "G3, J6";
        } else if (getCellValue(9, 6) === "b3") {
            return "J6, G9";
        } else if (getCellValue(6, 9) === "b3") {
            return "G9, D9";
        } else if (getCellValue(5, 0) === "b4") {
            return "F0, F4";
        } else if (getCellValue(5, 4) === "b4") {
            return "F4, F8";
        } else if (getCellValue(5, 8) === "b4") {
            return "F8, I8";
        } else if (getCellValue(4, 0) === "b4") {
            return "E0, E4";
        } else if (getCellValue(4, 4) === "b4") {
            return "E4, E8";
        } else if (getCellValue(4, 8) === "b4") {
            return "E8, I8";
        } else if (getCellValue(9, 1) === "b1") {
            return "J1, I2";
        } else if (getCellValue(8, 2) === "b1") {
            return "I2, H3";
        } else if (getCellValue(7, 3) === "b1") {
            return "H3, G4";
        } else if (getCellValue(6, 4) === "b1") {
            return "G4, G5";
        } else if (getCellValue(6, 5) === "b1") {
            return "G5, G6";
        } else if (getCellValue(6, 6) === "b1") {
            return "G6, G7";
        } else if (getCellValue(6, 7) === "b1") {
            return "G7, F8";
        } else if (getCellValue(5, 8) === "b1") {
            return "F8, G9";
        } else if (getCellValue(5, 1) === "b1") {
            return "F1, F2";
        } else if (getCellValue(5, 2) === "b1") {
            return "F2, F3";
        } else if (getCellValue(5, 3) === "b1") {
            return "F3, G4";
        } else if (getCellValue(6, 4) === "b1") {
            return "G4, G5";
        } else if (getCellValue(6, 5) === "b1") {
            return "G5, G6";
        } else if (getCellValue(6, 6) === "b1") {
            return "G6, G7";
        } else if (getCellValue(6, 7) === "b1") {
            return "G7, F8";
        } else if (getCellValue(5, 8) === "b1") {
            return "F8, G9";
        } else if (getCellValue(4, 1) === "b1") {
            return "E1, E2";
        } else if (getCellValue(4, 2) === "b1") {
            return "E2, F3";
        } else if (getCellValue(5, 3) === "b1") {
            return "F3, G4";
        } else if (getCellValue(6, 4) === "b1") {
            return "G4, G5";
        } else if (getCellValue(6, 5) === "b1") {
            return "G5, G6";
        } else if (getCellValue(6, 6) === "b1") {
            return "G6, G7";
        } else if (getCellValue(6, 7) === "b1") {
            return "G7, F8";
        } else if (getCellValue(5, 8) === "b1") {
            return "F8, G9";
        } else if (getCellValue(6, 1) === "b1") {
            return "G1, F2";
        } else if (getCellValue(5, 2) === "b1") {
            return "F2, F3";
        } else if (getCellValue(5, 3) === "b1") {
            return "F3, G4";
        } else if (getCellValue(6, 4) === "b1") {
            return "G4, G5";
        } else if (getCellValue(6, 5) === "b1") {
            return "G5, G6";
        } else if (getCellValue(6, 6) === "b1") {
            return "G6, G7";
        } else if (getCellValue(6, 7) === "b1") {
            return "G7, F8";
        } else if (getCellValue(5, 8) === "b1") {
            return "F8, G9";
        } else if (getCellValue(3, 1) === "b1") {
            return "D1, E2";
        } else if (getCellValue(4, 2) === "b1") {
            return "E2, F3";
        } else if (getCellValue(5, 3) === "b1") {
            return "F3, G4";
        } else if (getCellValue(6, 4) === "b1") {
            return "G4, G5";
        } else if (getCellValue(6, 5) === "b1") {
            return "G5, G6";
        } else if (getCellValue(6, 6) === "b1") {
            return "G6, G7";
        } else if (getCellValue(6, 7) === "b1") {
            return "G7, F8";
        } else if (getCellValue(5, 8) === "b1") {
            return "F8, G9";
        } else if (getCellValue(6, 0) === "b1") {
            return "G0, G1";
        } else if (getCellValue(6, 1) === "b1") {
            return "G1, F2";
        } else if (getCellValue(5, 2) === "b1") {
            return "F2, F3";
        } else if (getCellValue(5, 3) === "b1") {
            return "F3, G4";
        } else if (getCellValue(6, 4) === "b1") {
            return "G4, G5";
        } else if (getCellValue(6, 5) === "b1") {
            return "G5, G6";
        } else if (getCellValue(6, 6) === "b1") {
            return "G6, G7";
        } else if (getCellValue(6, 7) === "b1") {
            return "G7, F8";
        } else if (getCellValue(5, 8) === "b1") {
            return "F8, G9";
        } else if (getCellValue(3, 0) === "b1") {
            return "D0, D1";
        } else if (getCellValue(3, 1) === "b1") {
            return "D1, E2";
        } else if (getCellValue(4, 2) === "b1") {
            return "E2, F3";
        } else if (getCellValue(5, 3) === "b1") {
            return "F3, G4";
        } else if (getCellValue(6, 4) === "b1") {
            return "G4, G5";
        } else if (getCellValue(6, 5) === "b1") {
            return "G5, G6";
        } else if (getCellValue(6, 6) === "b1") {
            return "G6, G7";
        } else if (getCellValue(6, 7) === "b1") {
            return "G7, F8";
        } else if (getCellValue(5, 8) === "b1") {
            return "F8, G9";
        }
    }

    var board = gameState.board;
    var pieceLocations = getMyPieceLocations(getMyColor());

    var moves = new Array();

    for (var i = 0; i < pieceLocations.length; i++) {
        var piece = pieceLocations[i];

        var validMoves = getValidMoves(piece, getMyColor(), null);
        for (var j = 0; j < validMoves.length; j++) {
            var move = validMoves[j];

            moves.push(piece + ", " + move);
        }
    }

    if (moves.length === 0) {
        return "CHECKMATED";
    }

    return moves[Math.floor((Math.random() * moves.length))];
}