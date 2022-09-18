package Simulation;

import Strategy.RandomAI;
import API.API;

import java.util.Scanner;

/*
   -----------------------------------------------------------------------
   NOTE - Modify getAttackerMoveString() and/or getDefenderMoveString()
          to test a new AI.
   -----------------------------------------------------------------------
*/

// Sets up and runs a Battle, providing different modes to giving users the options of
// - choosing whether each player is MANUAL or AI
//   - the default AI is random, but this can be adjusted locally for testing
// - displaying detailed gamestate and debug info
public class SimulationApp {
    static boolean CONSOLE_APP = true;
    static boolean DEBUG = true;
    static boolean ATTACKER_MANUAL = false;
    static boolean DEFENDER_MANUAL = false;

    static final int BOARD_LENGTH = 10;

    static GameState gameState; // the gameState of the current game
    static Scanner scan; // scanner used to interact with the console (can be used for manual play)

    // Runs a battle with an infinite number of BattleGames, starting a fresh BattleGame when the previous completes
    public static void main(String[] args) {
        // ask for console setup info
        scan = new Scanner(System.in);
        System.out.println("\nDo you want to run in CONSOLE mode? (y, n)\n" +
                           "This mode prints out important information and prompts for input.\n" +
                            "This mode is the only way to play manually.");
        CONSOLE_APP = scan.nextLine().equals("y");

        if (CONSOLE_APP) {
            System.out.println("Do you want the ATTACKER to be MANUAL? (y, n)");
            ATTACKER_MANUAL = scan.nextLine().equals("y");
            System.out.println("ATTACKER set to " + (ATTACKER_MANUAL ? "AI" : "MANUAL"));
            System.out.println("Do you want the DEFENDER to be MANUAL? (y, n)");
            DEFENDER_MANUAL = scan.nextLine().equals("y");
            System.out.println("DEFENDER set to " + (DEFENDER_MANUAL ? "AI" : "MANUAL"));
        }

        System.out.println("\nDo you want to run in DEBUG mode? (y, n)\n" +
                           "This mode prints out more detailed status and error information.");
        DEBUG = scan.nextLine().equals("y");
        int numGames;
        while (true) {
            System.out.println("How many Games do you want in this Battle?  This must be an odd integer");
            try {
                numGames = Integer.parseInt(scan.nextLine());

                if (numGames % 2 == 1)
                    break;
            } catch (Exception e) { }
        }

        // setup Battle
        Battle battle = new Battle(numGames);

        while (numGames > 0) {
            //setup BattleGame
            BattleGame currentBattleGame = battle.addBattleGame();
            gameState = new GameState();

            Color gameWinner = playGame(battle, currentBattleGame);
            currentBattleGame.setWinner(gameWinner);
            battle.processGameWinner(currentBattleGame, gameWinner);

            if (CONSOLE_APP)
                System.out.println("Game Over ---- Launching next game...");

            //wait 1 second before creating a new game
            if (CONSOLE_APP)
                waitms(1000);
            numGames--;
        }
        int aWins = battle.getAttackerWins();
        int dWins = battle.getDefenderWins();
        System.out.printf("%s wins the Battle!  A-%d vs D-%d\n", aWins > dWins ? "ATTACKER" : "DEFENDER", aWins, dWins);
        battle.complete();

        debugPrintln(battle.toString());

        scan.close();
    }

    // runs one game loop, from creating a fresh board to returning
    // the winner at the end of the game
    static Color playGame(Battle battle, BattleGame battleGame) {
        Color winner;
        if (CONSOLE_APP || DEBUG) {
            System.out.printf("Game Starting.  ATTACKER - %s\t\t DEFENDER - %s\n", battleGame.getAttackerColor(), battleGame.getDefenderColor());
            if (CONSOLE_APP)
                waitms(3000);
            printBoard();
        }

        while (true) {

            // fetch player move
            if (CONSOLE_APP)
                System.out.println(playerString(gameState.currentPlayer) + "'s turn");
            String moveString = currentColor().equals(battleGame.getAttackerColor())
                                ? getAttackerMoveString(scan) : getDefenderMoveString(scan);

            // stores moveString in new turn, even if invalid
            battleGame.addTurn(battle.getId(), currentColor(), moveString);

            // validates move string
            boolean isValid = isMoveValid(moveString, gameState.board);
            if (!isValid) {
                if (DEBUG) {
                    System.out.printf("INVALID MOVE from %s: %s\n", playerString(gameState.currentPlayer), moveString);
                    System.out.println("Move String must be in the form \"<fromCell>, \"<toCell>\"");
                }
                winner = getPlayerColor(gameState.getOpponent());
                break;
            }

            // process player move
            processMove(moveString);

            if (CONSOLE_APP || DEBUG)
                printBoard();

            // end game if all of a player's pawns are captured
            if (gameState.numWhitePawns == 0) { // if white has lost all their pawns
                // white can only win in this situation if they initiated a move that captured
                // their opponents final pawn, as well as theirs simultaneously
                if (gameState.numBlackPawns == 0 && gameState.currentPlayer == gameState.WHITE) {
                    winner = Color.WHITE;
                    debugPrintln("WHITE has captured all pawns in the game");
                } else // otherwise, white losing all their pawns is a loss for white
                {
                    winner = Color.BLACK;
                    debugPrintln("WHITE has no more pawns");
                }

                break;
            }
            else if (gameState.numBlackPawns == 0) // if black is only side without pawns
            {
                winner = Color.WHITE;
                debugPrintln("BLACK has no more pawns");
                break;
            }

            // end game if piece(s) causing check remain
            if (isPlayerInCheck(currentColor(), gameState.board)) {
                winner = getPlayerColor(gameState.getOpponent());
                debugPrintln("turn started while final rank was reached");
                break;
            }

            alternatePlayer();
        }

        System.out.printf("---------------- FINAL BOARD STATE (%d/%d)----------------", battleGame.getGameNumber(), battle.getIterations() - 1);
        printBoard();
        System.out.printf("%s Wins!!!\n", winner.name());

        return winner;
    }

    // You can replace the contents of this function with the Attacker AI,
    // thus ignoring the Scanner for System.in
    //
    // Return string must be in the form "<fromCell>, <toCell>".
    static String getAttackerMoveString(Scanner scan) {
        debugPrintln("Fetching attacker's move");
        if (ATTACKER_MANUAL)
            return scan.nextLine();

        // ATTACKER set to AI mode
        String moveString = "";
        try {
            moveString = RandomAI.getMove(gameState);
        } catch (Exception e) {
            debugPrintf("Attacker Exception\n%s\n", e);
            if (DEBUG)
                e.printStackTrace();
        }

        return moveString;
    }

    // You can replace the contents of this function with the Defender AI,
    // thus ignoring the Scanner for System.in
    //
    // Return string must be in the form "<fromCell>, <toCell>".
    static String getDefenderMoveString(Scanner scan) {
        debugPrintln("Fetching defender's move");
        if (DEFENDER_MANUAL)
            return scan.nextLine();

        // DEFENDER set to AI mode
        String moveString = "";
        try {
            moveString = RandomAI.getMove(gameState);
        } catch (Exception e) {
            debugPrintf("Defender Exception\n%s\n", e);
            if (DEBUG)
                e.printStackTrace();
        }

        return moveString;
    }

    //adjusts the gameState based upon the moveString
    static void processMove(String moveString) {
        String[][] board = gameState.board;
        String[] moveCells = moveString.split(", ");

        String fromCell = moveCells[0];
        String toCell = moveCells[1];

        int fromMoveDistance = getPieceMoveDistance(fromCell, board);
        int toMoveDistance = getPieceMoveDistance(toCell, board);
        int fromCol = cellToCol(fromCell);
        int fromRow = cellToRow(fromCell);
        int toCol = cellToCol(toCell);
        int toRow = cellToRow(toCell);
        String fromPiece = board[fromCol][fromRow];
        String toPiece = board[toCol][toRow];
        Color fromColor = getPieceColor(fromCell, board);
        Color toColor = getPieceColor(toCell, board);
        debugPrintf("Move String: \"%s\"\nMoving [%d][%d] (%s) to [%d][%d] (%s)\n", moveString, fromCol, fromRow, fromPiece, toCol, toRow, toPiece);

        // copies piece to new location
        if (fromMoveDistance > toMoveDistance) { // attacker wins
            board[toCol][toRow] = board[fromCol][fromRow];
            processLosePiece(toColor, toMoveDistance);
        } else if (fromMoveDistance == toMoveDistance) // both pieces die upon a tie
        {
            board[toCol][toRow] = "";
            processLosePiece(fromColor, fromMoveDistance);
            processLosePiece(toColor, toMoveDistance);
        }else //if (fromMoveDistance < toMoveDistance) // defender wins
            processLosePiece(fromColor, fromMoveDistance);

        // removes piece from old location
        board[fromCol][fromRow] = "";

        gameState.numMovesMade++;
    }

    static boolean isPlayerInCheck(Color color, String[][] board) {
        int rowToCheck = (color == Color.WHITE) ? 9 : 0;
        String opponentOnePiece = (color == Color.WHITE) ? "b1" : "w1";

        for (int i = 0; i < BOARD_LENGTH; i++) {
            if (board[i][rowToCheck].equals(opponentOnePiece))
                return true;
        }

        return false;
    }

    // changes whose turn it is in the gameState
    public static void alternatePlayer() {
        gameState.currentPlayer = gameState.getOpponent();
    }

    public static void printBoard() {
        System.out.printf("\n\nMove %d: A\tB\tC\tD\tE\tF\tG\tH\tI\tJ\n", gameState.numMovesMade);
        for (int i = 0; i < BOARD_LENGTH; i++) {
            System.out.printf("%d\t{", i);
            for (int j = 0; j < BOARD_LENGTH; j++)
                System.out.printf("\t%s,", gameState.board[j][i]);
            System.out.print("\t},\n");
        }
        System.out.printf("W:%d\twPawns:%d\tB:%d\tbPawns:%d\n", gameState.numWhitePieces, gameState.numWhitePawns,
                gameState.numBlackPieces, gameState.numBlackPawns);
        System.out.print("\n\n");
    }

    // Returns true if the passed moveString is in the format "<fromCell>, <toCell>",
    // using valid cells.  A player cannot land on their own pieces, and moves
    // that try to take the piece further away from it
    public static boolean isMoveValid(String moveString, String[][] board) {
        String[] moveCells;
        try {
            moveCells = moveString.split(", ");
        } catch (Exception e) {
            debugPrintln("move string regex failed\n" + e);
            debugPrintln("Move is improperly formatted, so regex failed\n" + e);
            return false;
        }

        if (moveCells.length != 2) {
            debugPrintln("Move is improperly formatted");
            return false;
        }

        String fromCell = moveCells[0];
        String toCell = moveCells[1];

        if (!isCellValid(fromCell) || !isCellValid(toCell)) {
            debugPrintln("Move contains invalid cells.  Cell values range from \"A0\" to \"J9\"");
            return false;
        }

        int pieceMoveDistance;
        try {
            pieceMoveDistance = getPieceMoveDistance(fromCell, board);
        } catch (Exception e) {
            debugPrintln("getPieceMoveDistance exception\n" + e);
            return false;
        }

        if (pieceMoveDistance == 0) {
            debugPrintln("Trying to move a piece from an empty cell");
            return false;
        }

        if (getPieceColor(fromCell, board) != currentColor()) {
            debugPrintln("Trying to move the opponent's piece");
            return false;
        }

        if (getPieceColor(toCell, board) == currentColor()) {
            debugPrintln("Trying to capture an allied piece");
            return false;
        }

        boolean movingPieceTooFar = ((Math.abs(cellToRow(fromCell) - cellToRow(toCell)) > pieceMoveDistance)
                || (Math.abs(cellToCol(fromCell) - cellToCol(toCell)) > pieceMoveDistance));

        if (movingPieceTooFar)
            debugPrintln("Trying to move piece too far");

        return !movingPieceTooFar;
    }

    // returns true if the passed cell string is properly formatted
    //  and refers to a valid cell on the game board
    static boolean isCellValid(String cell) {
        if (cell == null || cell.length() != 2)
            return false;

        char colChar = cell.charAt(0);
        char rowChar = cell.charAt(1);

        return !((colChar < 'A' || colChar > 'J') || (rowChar < '0' || rowChar > '9'));
    }

    static int getPieceMoveDistance(String cell, String[][] board) {
        return (new API()).getPieceMoveDistance(cell, board);

        /*if (!isCellValid(cell))
            return 0;

        int col = cellToCol(cell);
        int row = cellToRow(cell);

        String cellVal = board[col][row];
        if (cellVal.equals(""))
            return 0;

        return Integer.parseInt(cellVal.substring(1));*/
    }

    static Color getPieceColor(String cell, String[][] board) {
        if (!isCellValid(cell))
            return Color.ERROR_PLAYER;

        int col = cellToCol(cell);
        int row = cellToRow(cell);

        String cellVal = board[col][row];
        if (cellVal.equals(""))
            return Color.ERROR_PLAYER;

        char colorChar = cellVal.charAt(0);
        return colorChar == 'w' ? Color.WHITE : Color.BLACK;
    }

    // returns the translation of the cell's first character to it's corresponding index in board[]
    static int cellToCol(String cell) {
        return cell.charAt(0) - 'A';
    }

    // returns the translation of the cell's second character to it's corresponding index in board[][]
    static int cellToRow(String cell) {
        return Integer.parseInt(cell.substring(1, 2));
    }

    // a string representing the passed player/color
    static String playerString(int player) {
        return Color.values()[player].name();
    }

    // updates the number of pieces still on the board in gameState
    static void processLosePiece(Color pieceColor, int pieceMoveDistance) {
        if (pieceColor == Color.WHITE) {
            gameState.numWhitePieces--;
            if (pieceMoveDistance == 1)
                gameState.numWhitePawns--;

            debugPrintln("\t\t\t\t\t\t\t\t\t\t\t\t\tLosing WHITE piece");
        } else if (pieceColor == Color.BLACK) {
            gameState.numBlackPieces--;
            if (pieceMoveDistance == 1)
                gameState.numBlackPawns--;

            debugPrintln("\t\t\t\t\t\t\t\t\t\t\t\t\tLosing BLACK piece");
        }
    }

    // performs a println if the application is in DEBUG mode
    static void debugPrintln(String s) {
        if (DEBUG)
            System.out.println(s);
    }

    // performs a printf if the application is in DEBUG mode
    static void debugPrintf(String format, Object... args) {
        if (DEBUG)
            System.out.printf(format, args);
    }

    static Color currentColor() {
        return getPlayerColor(gameState.currentPlayer);
    }

    static Color getPlayerColor(int player) {
        try {
            return Color.values()[player];
        } catch (Exception e) {
            return Color.ERROR_PLAYER;
        }
    }

    static void waitms(long msToWait) {
        long gameEndTime = System.currentTimeMillis();
        while (System.currentTimeMillis() < gameEndTime + msToWait) { }
    }
}