function getMove() {
    var capture1PieceMoves = getAllLegalCapture1PieceMoves();
    var captureMoves = getAllLegalCaptureMoves();

    if (capture1PieceMoves.length > 0) {
        return capture1PieceMoves[Math.floor((Math.random() * capture1PieceMoves.length))];
    }
    if (captureMoves.length > 0) {
        return captureMoves[Math.floor((Math.random() * captureMoves.length))];
    }

    return getRandomMove();
}
