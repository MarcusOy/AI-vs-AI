package Simulation;

public class GameState {
    // constants for a language-independent API
    public final int WHITE = 0;
    public final int BLACK = 1;

    // simple information about the current state of the game
    public int currentPlayer; // 0=WHITE 1=BLACK
    public int numWhitePieces = 20;
    public int numBlackPieces = 20;
    public int numWhitePawns = 9;
    public int numBlackPawns = 9;
    public int numMovesMade = 0;

    // The board is indexed [column][row], so A9 would be board[0][9].
    // Printouts display the board in the lower, commented-out orientation.
    public String[][] board = {
            { "b1", "b1", "", "", "", "", "", "", "w1", "w3"},
            { "b3", "b2", "", "", "", "", "", "", "w2", "w3"},
            { "b2", "b2", "", "", "", "", "", "", "w2", "w2"},
            { "b1", "b1", "", "", "", "", "", "", "w1", "w1"},
            { "b4", "b1", "", "", "", "", "", "", "w1", "w4"},
            { "b4", "b1", "", "", "", "", "", "", "w1", "w4"},
            { "b1", "b1", "", "", "", "", "", "", "w1", "w1"},
            { "b2", "b2", "", "", "", "", "", "", "w2", "w2"},
            { "b3", "b2", "", "", "", "", "", "", "w2", "w3"},
            { "b3", "b1", "", "", "", "", "", "", "w1", "w1"},
            /*{ "b3", "b3", "b2", "b1", "b4", "b4", "b1", "b2", "b3", "b1"},
            { "b1", "b2", "b2", "b1", "b1", "b1", "b1", "b2", "b2", "b1"},
            { "", "", "", "", "", "", "", "", "", ""},
            { "", "", "", "", "", "", "", "", "", ""},
            { "", "", "", "", "", "", "", "", "", ""},
            { "", "", "", "", "", "", "", "", "", ""},
            { "", "", "", "", "", "", "", "", "", ""},
            { "", "", "", "", "", "", "", "", "", ""},
            { "w1", "w2", "w2", "w1", "w1", "w1", "w1", "w2", "w2", "w1"},
            { "w3", "w3", "w2", "w1", "w4", "w4", "w1", "w2", "w3", "w1"}*/
    };

    public GameState() { }

    public int getOpponent() {
        return (currentPlayer + 1) % 2;
    }

    @Override
    public String toString() {
        return "GameState{" +
                "WHITE=" + WHITE +
                ", BLACK=" + BLACK +
                ", currentPlayer=" + currentPlayer +
                ", numWhitePieces=" + numWhitePieces +
                ", numWhitePawns=" + numWhitePawns +
                ", numBlackPieces=" + numBlackPieces +
                ", numBlackPawns=" + numBlackPawns +
                ", numMovesMade=" + numMovesMade +
                '}';
    }
}
