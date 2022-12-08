package Simulation;

import IStrategy.Strategy;

import java.util.ArrayList;
import java.util.UUID;
import java.util.regex.Pattern;

// Stores all info related to a series of consecutive BattleGames
// between the same two AI.
public class Battle {
    public String id;
    public String name;
    public int battleStatus;
    // Pending = 0
    // Success = 1
    // Fail = -1
    public int iterations;
    public int attackerWins;
    public int defenderWins;

    public Strategy attackingStrategy;
    public Strategy defendingStrategy;
    public String attackingStrategySnapshot;
    public String defendingStrategySnapshot;

    public String attackingStrategyId;
    public String defendingStrategyId;

    public boolean isTestSubmission;

    public ArrayList<BattleGame> battleGames;

    // internal fields for battle running functionality
    private int gamesCompleted;

    // internal fields for functionality beyond simply running a battle
    private int attackingSnapshotGetMoveLineNum;
    private int defendingSnapshotGetMoveLineNum;
    private int attackingSnapshotGetMoveLineNumCommented;
    private int defendingSnapshotGetMoveLineNumCommented;
    private String attackingSourceInjected;
    private String defendingSourceInjected;
    private ArrayList<Integer> attackerLineNumConversionList; // these are used to convert source w/ injected code -> original source
    private ArrayList<Integer> defenderLineNumConversionList;

    // Only internally used for fairness... Doesn't need to be stored or printed
    // Decided randomly in constructor
    private boolean willAttackerStartWhite;

    private String clientId;

    public Battle() {
        id = UUID.randomUUID().toString();
        init();
    }

    public Battle(int iterations, String attackingStrategyId, String defendingStrategyId, String attackingStrategySnapshot, String defendingStrategySnapshot,
                  Strategy attackingStrategy, Strategy defendingStrategy) {
        this();
        this.attackingStrategyId = attackingStrategyId;
        this.defendingStrategyId = defendingStrategyId;
        this.attackingStrategySnapshot = attackingStrategySnapshot;
        this.defendingStrategySnapshot = defendingStrategySnapshot;
        this.attackingStrategy = attackingStrategy;
        this.defendingStrategy = defendingStrategy;

        this.iterations = iterations;
    }

    public void init() {
        battleGames = new ArrayList<>();
        willAttackerStartWhite = Math.random() < 0.5; // 50% odds the attacker will start white
        attackingSnapshotGetMoveLineNum = -1;
        defendingSnapshotGetMoveLineNum = -1;
        attackingSnapshotGetMoveLineNumCommented = -1;
        defendingSnapshotGetMoveLineNumCommented = -1;
        //System.out.println("initting " + id);
        battleStatus = 0;
    }

    // sets stored snapshot getMove() lineNum values
    public void setGetMoveLineNum(int lineNum, boolean isAttacker, int lineNumCommented) {
        //System.out.println("lineNum: " + lineNum + "    isAttacker: " + isAttacker + "    " + id);
        if (isAttacker) {
            attackingSnapshotGetMoveLineNum = lineNum;
            attackingSnapshotGetMoveLineNumCommented = lineNumCommented;
        } else {
            defendingSnapshotGetMoveLineNum = lineNum;
            defendingSnapshotGetMoveLineNumCommented = lineNumCommented;
        }
    }

    // sets up lists for lineNum conversion from source w/ injected code -> original source
    public void setupLineNumConversionList(boolean isAttacker, String sourceWithInjectedCode) {
        //System.out.println("setup");
        String source;
        ArrayList<Integer> lineConversionList;

        if (isAttacker) {
            source = attackingStrategySnapshot;
            defenderLineNumConversionList = new ArrayList<>();
            lineConversionList = defenderLineNumConversionList;
        } else {
            source = defendingStrategySnapshot;
            attackerLineNumConversionList = new ArrayList<>();
            lineConversionList = attackerLineNumConversionList;
        }

        if (source == null || sourceWithInjectedCode == null)
            return;

        //System.out.println("originalSource: " + source + "\ninjectedSource: " + sourceWithInjectedCode);

        // setup originalSource
        int indexOfGetMove = source.indexOf("getMove()");
        int newLineIndex;
        int originalLineNum = 0;

        // setup injectedSource
        int indexOfGetMoveInjected = sourceWithInjectedCode.indexOf("getMove()");
        int indexOfGetExecString = sourceWithInjectedCode.indexOf("function " + SimulationApp.EXECUTION_TRACKER_FUNC_NAME + "() {");
        int newLineIndexInjected;
        int injectedLineNum = 0;

        // workingStrings to scan across sourceStrings
        String workingSourceString = SimulationApp.parseOutComments(source.substring(indexOfGetMove));
        int injectedSourceEndIndex = indexOfGetExecString > 0 ? indexOfGetExecString : sourceWithInjectedCode.length();
        String workingInjectedSourceString = SimulationApp.parseOutComments(sourceWithInjectedCode.substring(indexOfGetMoveInjected, injectedSourceEndIndex));

        while ((newLineIndex = workingSourceString.indexOf("\n")) >= 0) {
            String curOriginalLine = workingSourceString.substring(0, newLineIndex).trim();

            //System.out.print(originalLineNum + ":  " + workingSourceString.substring(0, newLineIndex + 1));
            workingSourceString = workingSourceString.substring(newLineIndex + 1);

            // counts the read newline character to determine what line getMove() starts on
            originalLineNum++;

            while ((newLineIndexInjected = workingInjectedSourceString.indexOf("\n")) >= 0) {
                String curInjectedLine = workingInjectedSourceString.substring(0, newLineIndexInjected);

                //System.out.print(injectedLineNum + ":i  " + workingInjectedSourceString.substring(0, newLineIndexInjected + 1));
                workingInjectedSourceString = workingInjectedSourceString.substring(newLineIndexInjected + 1);

                lineConversionList.add(originalLineNum);

                // counts the read newline character to determine what line getMove() starts on
                injectedLineNum++;

                final int SHRUNK_LINE_SIZE = 4;
                String shrunkLine = curOriginalLine.length() <= SHRUNK_LINE_SIZE ? curOriginalLine : curOriginalLine.substring(0, SHRUNK_LINE_SIZE);
                if (curInjectedLine.matches("\\A.*" + Pattern.quote(shrunkLine) + ".*")) {
                    //System.out.println("originalLine: " + curOriginalLine + " matches w/ injectedLine: " + curInjectedLine);
                    break;
                }
                //System.out.println("skipping line: " + curInjectedLine);
            }
        }

        for (int i = 0; i < lineConversionList.size(); i++) {
            int line = lineConversionList.get(i);
            //System.out.println("line " + i + " maps to " + line);
        }

        if (isAttacker)
            attackerLineNumConversionList = lineConversionList;
        else
            defenderLineNumConversionList = lineConversionList;
    }

    // returns the newly created BattleGame
    public BattleGame addBattleGame() {
        // alternates attacker color every consecutive BattleGame
        Color attackerColor = getAttackerColor();
        battleGames.add(new BattleGame(battleGames.size() + 1, id, attackerColor));

        return battleGames.get(battleGames.size() - 1);
    }

    // handles the ending of a BattleGame
    public void processGameWinner(BattleGame battleGame, Color winner) {
        boolean didAttackerWin = battleGame.getAttackerColor().equals(winner);

        if (didAttackerWin)
            attackerWins++;
        else
            defenderWins++;

        gamesCompleted++;

        // converts invoke error stack trace line numbers to ignore helper code lines
        convertStackTraceLineNumbers(battleGame, didAttackerWin);
    }

    private void convertStackTraceLineNumbers(BattleGame battleGame, boolean didAttackerWin) {
        //System.out.println("convert");
        String workingStackTrace = battleGame.stackTrace;
        int lineOfGetMove = didAttackerWin ? defendingSnapshotGetMoveLineNum : attackingSnapshotGetMoveLineNum;
        int lineOfGetMoveCommented = didAttackerWin ? defendingSnapshotGetMoveLineNumCommented : attackingSnapshotGetMoveLineNumCommented;
        ArrayList<Integer> lineConversionList = didAttackerWin ? defenderLineNumConversionList : attackerLineNumConversionList;

        if (lineConversionList == null) {
            if (didAttackerWin) {
                setupLineNumConversionList(false, defendingSourceInjected);
                lineConversionList = defenderLineNumConversionList;
            }
            else {
                setupLineNumConversionList(true, attackingSourceInjected);
                lineConversionList = attackerLineNumConversionList;
            }
        }

        //System.out.println("attack: " + attackingSnapshotGetMoveLineNum + "   defend: " + defendingSnapshotGetMoveLineNum + "   chosen: " + lineOfGetMove);
        if (workingStackTrace == null || workingStackTrace.trim().length() <= 0 || lineOfGetMove < 1)
            return;

        // finds all instances of "line number <#>, replacing them with the converted line number"
        String matchString = "at line number ";
        int indexOfLineNumber;
        int offsetInStackTraceString = 0;
        String lineNumberScrubbedStackTrace = "";
        while (workingStackTrace.length() > 0 && (indexOfLineNumber = workingStackTrace.indexOf(matchString)) >= 0) {
            // moves "cursor" to first char after match
            int newIndex = indexOfLineNumber + matchString.length();
            workingStackTrace = workingStackTrace.substring(newIndex);
            offsetInStackTraceString += newIndex;

            // parses string to determine the range in which the line number value can be found
            int lineNumStartIndex = -1;
            int lineNumEndIndex; // this is the index after the last
            String lineNumString = "";
            while (true) {
                char curChar = workingStackTrace.charAt(0);

                try {
                    Integer.parseInt(curChar + "");
                    lineNumString += curChar;

                    if (lineNumStartIndex < 0)
                        lineNumStartIndex = offsetInStackTraceString;
                } catch (Exception e) {
                    lineNumEndIndex = offsetInStackTraceString;
                    break;
                }

                workingStackTrace = workingStackTrace.substring(1);
                offsetInStackTraceString++;
            }

            // replaces line number with original source line number
                // now just removes the line number
            if (lineNumStartIndex >= 0) {
                int prevLineNum = Integer.parseInt(lineNumString);
                String prevStackTrace = battleGame.stackTrace;
                String a = /*prevStackTrace.substring(0, indexOfLineNumber);*/prevStackTrace.substring(0, lineNumStartIndex);
                int injectedIndex = prevLineNum - lineOfGetMoveCommented + 3;
                //System.out.println(prevLineNum + " - " + lineOfGetMoveCommented + " + 3 = " + injectedIndex);

                // clamps injectedIndex to be in bounds
                if (injectedIndex < 0)
                    injectedIndex = 0;
                else if (injectedIndex >= lineConversionList.size())
                    injectedIndex = lineConversionList.size() - 1;

                int b = lineConversionList.get(injectedIndex);
                String c = prevStackTrace.substring(lineNumEndIndex);
                battleGame.stackTrace = a + b + c;
            }
        }
    }

    // handles the completion of the Battle
    public void complete(boolean battleFailed) {
        // removes helper code from both the battle's source code snapshots
        //attackingStrategySnapshot = removeHelperCode(attackingStrategySnapshot, attackingSnapshotGetMoveLineNum);
        //defendingStrategySnapshot = removeHelperCode(defendingStrategySnapshot, defendingSnapshotGetMoveLineNum);

        // sets the state of the battle to complete
        battleStatus = battleFailed ? -1 : 1;
    }

    // removes all helper code from strategy source code
    private String removeHelperCode(String sourceCode, int getMoveIndex) {
        if (sourceCode == null || getMoveIndex < 0) // doesn't remove helper code if getMove() can't be find to determine where helper code ends
            return sourceCode;

        return sourceCode.substring(getMoveIndex);
    }

    public String printBattleGames() {
        StringBuilder s = new StringBuilder();

        for (BattleGame b : battleGames) {
            s.append("\n\t");
            s.append(b.toString());
        }

        return s.toString();
    }

    public String getId() {
        return id;
    }

    public int getIterations() {
        return iterations;
    }

    public int getAttackerWins() {
        return attackerWins;
    }

    public int getDefenderWins() {
        return defenderWins;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientId() {
        return this.clientId;
    }

    public Color getAttackerColor() {
        // used to make attacker start the color that willAttackerStartWhite dictates
        int startOffset = willAttackerStartWhite ? 0 : 1;

        return (gamesCompleted + startOffset) % 2 == 0 ? Color.WHITE : Color.BLACK;
    }

    public String getInjectedSource(boolean isAttacker) {
        return isAttacker ? attackingSourceInjected : defendingSourceInjected;
    }

    // sets the stored Injected source values
    public void setInjectedSource(String injectedSource, boolean isAttacker) {
        if (isAttacker)
            attackingSourceInjected = injectedSource;
        else
            defendingSourceInjected = injectedSource;
    }

    public Strategy getAttackerStrategy() {
        return attackingStrategy;
    }

    @Override
    public String toString() {
        return "Battle{" +
                "id=" + id +
                ", battleStatus=" + battleStatus +
                ", attackingStrategyId=" + attackingStrategyId +
                ", defendingStrategyId=" + defendingStrategyId +
                ", attackingSnapshot=" + attackingStrategyId +
                ", defendingSnapshot=" + defendingStrategyId +
                ", iterations=" + iterations +
                ", attackerWins=" + attackerWins +
                ", defenderWins=" + defenderWins +
                ", gamesCompleted=" + defenderWins +
                ", battleGames=" + printBattleGames() /* battleGames */ +
                '}';
    }
}
