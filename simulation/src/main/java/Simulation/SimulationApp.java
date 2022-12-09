package Simulation;

import API.Java.API;

import javax.script.*;
import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import IStrategy.IStrategy;
import IStrategy.RandomAI;
import IStrategy.EasyAI;
import IStrategy.TrueRandomAI;
import IStrategy.MediumAI;
import IStrategy.HardAI;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;
import delight.nashornsandbox.NashornSandbox;
import delight.nashornsandbox.NashornSandboxes;
import io.github.cdimascio.dotenv.Dotenv;
import org.apache.commons.cli.*;

/*
   ----------------------------------------------------------------------------
   NOTE - Modify setupStrategies() to test a new AI (Strategy).
              - New files with AI code must implement the Strategy interface.
              - The return value of Strategy.getMove() must follow the format,
                    "<cellFrom>, <cellTo>", where a cell is a string representing
                    a spot on the grid, with values from "A0-J9"
   ----------------------------------------------------------------------------
*/

// Sets up and runs a Battle, providing different modes to giving users the options of
// - choosing whether each player is MANUAL or AI
//   - the default AI is random, but this can be adjusted locally for testing
// - displaying detailed gamestate and debug info
public class SimulationApp {
    public final static String REQ_QUEUE_NAME = "SimulationRequests";
    final static String RESP_QUEUE_NAME = "SimulationResponses";
    final static String REQ_QUEUE_NAME_MANUAL = "SimulationStepRequests";
    final static String RESP_QUEUE_NAME_MANUAL = "SimulationStepResponses";
    public final static String MESSAGE_DELIMITER = " ;;;;; ";
    final static String PRINT_DELIMITER = "█";

    public static String ENV_HOST = "AVA__RABBITMQ__HOST";
    public static String ENV_USER = "AVA__RABBITMQ__USER";
    public static String ENV_PASS = "AVA__RABBITMQ__PASS";
    public static String ENV_PORT = "AVA__RABBITMQ__PORT";
    
    public static String EXECUTION_TRACKER_VAR_NAME = "ExecString";
    public static String EXECUTION_TRACKER_FUNC_NAME = "get" + EXECUTION_TRACKER_VAR_NAME;

    //static ScriptEngine attackingEngine;
    //static ScriptEngine defendingEngine;
    static NashornSandbox attackingSandbox;
    static NashornSandbox defendingSandbox;

    static IStrategy stockAttacker;
    static IStrategy stockDefender;

    static boolean CONSOLE_APP;
    static boolean DEBUG;
    static boolean ATTACKER_MANUAL;
    static boolean DEFENDER_MANUAL;
    static boolean NO_COMMUNICATION;
    static boolean JAVASCRIPT_STOCK;
    static boolean DEMO_STOCK;

    static boolean attackerStockOverride;
    static boolean defenderStockOverride;

    static final int BOARD_LENGTH = 10;

    static GameState gameState; // the gameState of the current game
    static Scanner scan; // scanner used to interact with the console (can be used for manual play)

    static int numGames;
    static String lastMoveString;

    // used to access defender strategy source and version for selecting a stock
    // defender override, if necessary
    // doesn't track with the battle throughout all modifications
    static Battle mostlyCurrentBattle = null;

    // used to select a stock for manual play
    static UUID manualPlayStockId = null;

    // used to track executionTrace per turn, stackTrace, and printInfo for a battle or battlegame
    static String[] compressedExecutionTraceHolder = new String[3];

    // Runs a battle with an infinite number of BattleGames, starting a fresh
    // BattleGame when the previous completes
    public static void main(String[] args)
            throws IOException, TimeoutException, URISyntaxException, NoSuchAlgorithmException, KeyManagementException {

        // makes sandbox recognize where jar is located at beginning of simulation, not beginning of first request
        NashornSandbox sandbox = NashornSandboxes.create();

        /*if (9 * 7 - 2 > 0) {
            String[][] testBoardWithIds = {
                    { "00b1", "01b1", "", "", "", "19w4", "", "", "02w1", "03w3"},
                    { "04b3", "05b2", "", "", "", "", "", "", "06w2", "07w3"},
                    { "08b2", "09b2", "", "", "", "", "", "", "10w2", "11w2"},
                    { "12b1", "13b1", "", "", "", "", "", "", "14w1", "15w1"},
                    { "16b4", "17b1", "", "", "", "", "", "", "18w1", ""},
                    { "20b4", "21b1", "", "", "", "26w1", "", "", "22w1", "23w4"},
                    { "24b1", "25b1", "", "", "", "", "", "", "", "27w1"},
                    { "28b2", "29b2", "", "", "", "", "", "", "30w2", "31w2"},
                    { "", "33b2", "", "32b3", "", "", "", "", "34w2", "35w3"},
                    { "36b3", "37b1", "", "", "", "", "", "", "38w1", "39w1"},
            };
            SimulationStepRequest manRequest = new SimulationStepRequest(testBoardWithIds, true, "testUser", UUID.randomUUID(), getRandomAIJS());
            initializeManualGameState(manRequest);
            String[][] reqIdlessBoard = deepCopyBoard(gameState.board);
            printBoardGeneric(testBoardWithIds);
            printBoardGeneric(reqIdlessBoard);

            boolean isManualStock = isIdStockId(manRequest.strategyId);
            if (isManualStock) {
                manualPlayStockId = manRequest.strategyId;
                setupStrategies();
            }
            else {
                // this battle
                Battle tempBattle = new Battle(numGames, "No Attacker for Step Play", manRequest.strategyId.toString(), null, manRequest.strategySnapshot);
                tempBattle.id = UUID.randomUUID().toString();

                // uses tempBattle's snapshot fields to set up fields for the attacking and defending strategies
                processBattleStrategies(tempBattle);
            }

            // resets execTrace and stackTrace
            compressedExecutionTraceHolder = new String[2];

            Color potentialWinner = playTurn(true, isManualStock, null, null);
            String[][] responseBoard = addPieceIds(manRequest, reqIdlessBoard);
            System.out.println(lastMoveString);
            printBoardGeneric(responseBoard);

            return;
        }*/

        // parse command line arguments
        if (parseCLI(args)) {
            // ends app if parseCLI() returns true
            return;
        }

        if (!NO_COMMUNICATION) {
            // establishes connection to message broker queue
            ConnectionFactory factory = new ConnectionFactory();
            setupConnection(factory);
            // System.out.println(factory.getClientProperties());
            Connection connection = factory.newConnection();
            System.out.println("created RabbitMQ connection");
            Channel channel = connection.createChannel();

            // Creates queue if not already created an prepares to listen for messages
            channel.queueDeclare(REQ_QUEUE_NAME, true, false, false, null);
            channel.queueDeclare(REQ_QUEUE_NAME_MANUAL, true, false, false, null);
            System.out.println(" [*] Waiting for messages.");

            // Sends callback to sender (2-AI battle)
            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                mostlyCurrentBattle = null;
                manualPlayStockId = null;
                String message = new String(delivery.getBody(), "UTF-8");
                System.out.println(" [x] Received '" + message + "'");

                // processes message
                Battle sentBattle = processMessage(message);
                mostlyCurrentBattle = sentBattle;

                // resets execTrace and stackTrace
                compressedExecutionTraceHolder = new String[3];

                prepareAndRunBattle(sentBattle);
                //System.out.println("\n\nEnter number of games to simulate.  [must be odd!]");
            };

            // Sends callback to sender (1 manual player vs stock AI) or more generally (anything vs sent AI)
            DeliverCallback deliverCallbackManual = (consumerTag, delivery) -> {
                mostlyCurrentBattle = null;
                manualPlayStockId = null;
                String message = new String(delivery.getBody(), "UTF-8");
                System.out.println(" [x] Received '" + message + "'");

                // also initializes gameState upon success
                SimulationStepRequest manRequest = processMessageManual(message);
                initializeManualGameState(manRequest.sentBoard, manRequest.isWhiteTurn);
                String[][] reqIdlessBoard = deepCopyBoard(gameState.board);

                boolean isManualStock = isIdStockId(manRequest.strategyId);
                boolean errorInSource = false;
                if (isManualStock) {
                    manualPlayStockId = manRequest.strategyId;
                    setupStrategies();
                }
                else {
                    // temp battle so processBattleStrategies can be used
                    Battle tempBattle = new Battle(numGames, "No Attacker for Step Play", manRequest.strategyId.toString(), null, manRequest.strategySnapshot, null, null, false);

                    // uses tempBattle's snapshot fields to set up fields for the attacking and defending strategies
                    errorInSource = !processBattleStrategies(tempBattle);
                }

                // resets execTrace and stackTrace
                compressedExecutionTraceHolder = new String[3];

                Color potentialWinner = null;
                if (!errorInSource) // only runs the turn if there isn't invalid source to run
                    potentialWinner = playTurn(true, isManualStock, null, null);

                String[][] responseBoard = addPieceIds(manRequest.sentBoard, reqIdlessBoard, manRequest.isWhiteTurn);
                SimulationStepResponse resp = new SimulationStepResponse(responseBoard, lastMoveString,
                        potentialWinner != null, Color.WHITE.equals(potentialWinner) != manRequest.isWhiteTurn,
                        manRequest.clientId);
                sendRabbitMQMessage(resp, RESP_QUEUE_NAME_MANUAL);
            };

            // listens for messages
            System.out.println("listening");
            channel.basicConsume(REQ_QUEUE_NAME, true, deliverCallback, consumerTag -> {
            });
            channel.basicConsume(REQ_QUEUE_NAME_MANUAL, true, deliverCallbackManual, consumerTag -> {
            });
            System.out.println("after consume call");

            /*
             * SimTestProducer p1 = new SimTestProducer();
             *
             * System.out.println("\n\nEnter number of games to simulate.  [must be odd!]");
             * while (true) {
             * String inString = scan.nextLine();
             * int inputNumGames = 1;
             * try {
             * inputNumGames = Integer.parseInt(inString);
             * p1.createConnection(inputNumGames);
             * } catch (Exception e) {
             * System.out.println("invalid number of games - must be an odd digit");
             * }
             * }
             */
        } else /* if (NO_COMMUNICATION) */ {
            // uses stdin to start battles
            // Strategies are either stock Strategies or manual-input from stdin

            // set up stdin input
            scan = new Scanner(System.in);

            while (true) {
                // gets a valid number of games
                while (true) {
                    /*System.out.println("longestTrace: " + Turn.longestLineTrace);
                    Turn.longestLineTrace = "";*/
                    System.out.println("\n\nHow many Games do you want in this Battle?  This must be an odd integer");
                    try {
                        numGames = Integer.parseInt(scan.nextLine());
                        if (numGames % 2 == 1)
                            break;
                    } catch (Exception e) {
                    }
                    System.out.println("invalid number of games");
                }

                // processes the Battle
                String attackerIdString = ATTACKER_MANUAL ? "manual" : "stock";
                String defenderIdString = DEFENDER_MANUAL ? "manual" : "stock";
                String attackerSnapshot = null;
                String defenderSnapshot = null;
                Battle newBattle = new Battle(numGames, attackerIdString, defenderIdString, attackerSnapshot, defenderSnapshot, null, null, false);
                prepareAndRunBattle(newBattle);
            }
        }
    }

    // parses the arguments passed to the program for flags
    // Returns true if the program should exit
    static boolean parseCLI(String[] args) {
        CommandLineParser parser = new BasicParser();
        Options options = new Options();

        options.addOption("c", "console", false, "This mode prints out important information and prompts for input.  " +
                "This mode is the only way to play manually. (use -ma and -md flags for manual play)");
        options.addOption("d", "debug", false, "Prints out more detailed status and error information.");
        options.addOption("ma", "manualattacker", false,
                "Makes the attacker require manual input for moves.  (Also triggers the -n and -c flags)");
        options.addOption("md", "manualdefender", false,
                "Makes the defender require manual input for moves.  (Also triggers the -n and -c flags)");
        options.addOption("n", "nocommunication", false,
                "Makes SimulationApp run without RabbitMQ connections, using stdin instead");
        options.addOption("j", "javascriptstock", false,
                "Uses a hardcoded javascript Stock strategy for any non-manual strategy.  (Also triggers the -n flag)");
        options.addOption("o", "demostock", false,
                "Uses a very easy stock strategy for quick manual demo.  (Also triggers the -n flag)");
        options.addOption("h", "help", false, "Shows usage");
        options.addOption("u", "usage", false, "Shows usage");

        try {
            CommandLine commandLine = parser.parse(options, args);

            boolean passedNoArgs = args == null || args.length == 0;

            if (passedNoArgs || commandLine.hasOption("h") || commandLine.hasOption("u")) {
                HelpFormatter formatter = new HelpFormatter();
                formatter.printHelp("SimulationApp", options);

                if (!passedNoArgs)
                    return true;
            } else {
                DEBUG = commandLine.hasOption("d");
                ATTACKER_MANUAL = commandLine.hasOption("ma");
                DEFENDER_MANUAL = commandLine.hasOption("md");
                JAVASCRIPT_STOCK = commandLine.hasOption("j");
                DEMO_STOCK = commandLine.hasOption("o");
                CONSOLE_APP = ATTACKER_MANUAL || DEFENDER_MANUAL || commandLine.hasOption("c");
                NO_COMMUNICATION = ATTACKER_MANUAL || DEFENDER_MANUAL || JAVASCRIPT_STOCK || DEMO_STOCK
                        || commandLine.hasOption("n");

                if (CONSOLE_APP)
                    System.out.print("CONSOLE_APP mode, ");
                if (DEBUG)
                    System.out.print("DEBUG mode, ");
                if (ATTACKER_MANUAL)
                    System.out.print("ATTACKER_MANUAL mode, ");
                if (DEFENDER_MANUAL)
                    System.out.print("DEFENDER_MANUAL mode, ");
                if (NO_COMMUNICATION)
                    System.out.print("NO_COMMUNICATION mode, ");
                if (JAVASCRIPT_STOCK)
                    System.out.print("JAVASCRIPT_STOCK mode, ");
                if (DEMO_STOCK)
                    System.out.print("DEMO_STOCK mode, ");
                System.out.println();
            }
        } catch (ParseException e) {
            System.out.println("Argument parsing failed... closing SimulationApp");
            e.printStackTrace();
            return true;
        }

        return false;
    }

    // gets the URI for connection config
    public static void setupConnection(ConnectionFactory factory) {
        // read .env file if run locally
        System.out.println("Trying to get environment variables from .env...");
        try {
            Dotenv dotenv = Dotenv.load();

            factory.setUsername(dotenv.get(ENV_USER));
            factory.setPassword(dotenv.get(ENV_PASS));
            factory.setHost(dotenv.get(ENV_HOST));
            factory.setPort(Integer.parseInt(dotenv.get(ENV_PORT)));
            System.out.println("Variables from .env set.");
        } catch (Exception ex) {
            // read from environment vars if run in docker
            System.out.println("Failed to use .env file. Getting variables from OS environment...");
            factory.setUsername(System.getenv(ENV_USER));
            factory.setPassword(System.getenv(ENV_PASS));
            factory.setHost(System.getenv(ENV_HOST));
            factory.setPort(Integer.parseInt(System.getenv(ENV_PORT)));
            System.out.println("Variables from OS environment set.");
        }

    }

    // processes the board sent from a manual play window,
    // parsing the cells to create a usable gamestate
    static void initializeManualGameState(String[][] board, boolean isWhiteTurn) {
        gameState = new GameState();

        // override initialized fields
        gameState.numBlackPawns = 0;
        gameState.numBlackPieces = 0;
        gameState.numWhitePawns = 0;
        gameState.numWhitePieces = 0;

        gameState.currentPlayer = isWhiteTurn ? 0 : 1;
        API api = new API();

        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                String curVal = board[i][j];
                if (curVal.equals(""))
                    gameState.board[i][j] = curVal;
                else
                    gameState.board[i][j] = curVal.substring(2); // assumes that the piece id is the first 2 chars of
                                                                 // cellVal

                String cellString = api.colAndRowToCell(i, j);

                if (getPieceColor(cellString, gameState.board).equals(Color.WHITE)) {
                    gameState.numWhitePieces++;

                    if (getPieceMoveDistance(cellString, gameState.board) == 1)
                        gameState.numWhitePawns++;
                } else if (getPieceColor(cellString, gameState.board).equals(Color.BLACK)) {
                    gameState.numBlackPieces++;

                    if (getPieceMoveDistance(cellString, gameState.board) == 1)
                        gameState.numBlackPawns++;
                }
            }
        }
    }

    // add the pieceIds back to the gameState board for sending back to a manual
    // play window
    static String[][] addPieceIds(String[][] requestBoard, String[][] reqIdlessBoard, boolean isWhiteTurn) {
        String[][] responseBoard = gameState.board;
        Color AIColor = isWhiteTurn ? Color.WHITE : Color.BLACK;
        String preMovePieceString = null; // with ID
        String postMovePieceString = null; // without ID
        int postMovePieceCol = -1;
        int postMovePieceRow = -1;

        for (int i = 0; i < responseBoard.length; i++) {
            for (int j = 0; j < responseBoard[i].length; j++) {
                String requestVal = requestBoard[i][j];
                String requestValSub = requestVal.length() == 0 ? requestVal : requestVal.substring(2); // assumes ID is
                                                                                                        // first 2 chars
                String responseVal = responseBoard[i][j];
                boolean inReq = !requestVal.equals("");
                boolean inResp = !responseVal.equals("");
                boolean changed = inReq != inResp || !requestValSub.equals(responseVal);

                // re-adds ids wherever possible
                if (inReq && !changed) // if unchanged piece, copy id over
                    responseBoard[i][j] = requestVal;
                else if (inReq && !inResp
                        && getPieceColor((new API()).colAndRowToCell(i, j), reqIdlessBoard).equals(AIColor)) { // if moved
                                                                                                             // from
                    preMovePieceString = requestVal;
                } else if (inResp && changed) { // if moved to
                    postMovePieceString = responseVal;
                    postMovePieceCol = i;
                    postMovePieceRow = j;
                }
            }
        }

        /*System.out.println("preMoveString: " + preMovePieceString + "  postMoveString: " + postMovePieceString
                + "  [c,r]: [" + postMovePieceCol + ", " + postMovePieceRow + "]");*/

        if (postMovePieceString != null)
            responseBoard[postMovePieceCol][postMovePieceRow] = preMovePieceString;

        return responseBoard;
    }

    // processes the message sent to the app to setup the board for a turn of a
    // manual game
    // Returns the board if no parsing errors
    static SimulationStepRequest processMessageManual(String message) {
        // try parsing manual play

        // parses JSON
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        try {
            MassTransitMessage<SimulationStepRequest> sentMessage = mapper.readValue(message,
                    new TypeReference<MassTransitMessage<SimulationStepRequest>>() {
                    });
            return sentMessage.message;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            System.out.println("JSON parsing of MassTransitMessage<SimulationRequestManual> failed: " + message);
            return null;
        }
    }

    // processes the message sent to the app to create a new battle
    // Returns true if no parsing errors
    static Battle processMessage(String message) {

        // parses JSON
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        Battle sentBattle;
        try {
            MassTransitMessage<SimulationRequest> sentMessage = mapper.readValue(message,
                    new TypeReference<MassTransitMessage<SimulationRequest>>() {
                    });
            sentBattle = sentMessage.message.pendingBattle;
            sentBattle.setClientId(sentMessage.message.clientId);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            System.out.println("JSON parsing of MassTransitMessage<SimulationRequest> failed: " + message);
            return null;
        }

        return sentBattle;
    }

    // prepares for a battle and runs it if sentBattle is valid
    static void prepareAndRunBattle(Battle sentBattle) {
        if (sentBattle != null) {
            // sets up battle
            sentBattle.init();

            // uses sentBattle's snapshot fields to set up fields for the attacking and defending strategies
            boolean wasSourceEvalError = !processBattleStrategies(sentBattle); // if source code had no evaluation errors
            if (!wasSourceEvalError) { // doesn't run battle if there was a source evaluation error
                // runs testing suite
                if (sentBattle.isTestSubmission) {
                    sentBattle.testSuiteResult = runTestingSuite(sentBattle.attackingStrategySnapshot, sentBattle.attackingStrategyId);
                    compressedExecutionTraceHolder = new String[3];
                }

                numGames = sentBattle.getIterations();

                if (numGames % 2 == 1) {
                    // runs battle if message was properly parsed
                    runBattle(sentBattle);
                } else {
                    System.out.println("numGames must be odd, not: " + numGames);
                }
            }

            sentBattle.complete(wasSourceEvalError);
        }

        debugPrintln("Finished Battle:\n" + sentBattle == null ? "null" : sentBattle.toString());

        // sends the resulting battle to the backend if there is RabbitMQ connection
        // allowed
        if (!NO_COMMUNICATION) {
            // sends message back to backend
            sendRabbitMQMessage(new SimulationResponse(sentBattle, sentBattle == null ? null : sentBattle.getClientId()), RESP_QUEUE_NAME);
        }
    }

    // uses sentBattle's snapshot fields to setup fields related to the attacker and defender strategy
    // Returns
    //      false if there was a source code evaluation error
    static boolean processBattleStrategies(Battle sentBattle) {
        // tries to evaluate attacking snapshot
        try {
            if (sentBattle.attackingStrategySnapshot != null) {
                attackerStockOverride = false;
                attackingSandbox = evaluateSourceCode(sentBattle.attackingStrategySnapshot, true, sentBattle);
            }
            else
                attackerStockOverride = true;
        } catch (Exception e) {
            e.printStackTrace();
            handleEvaluationError(sentBattle, Color.WHITE.equals(sentBattle.getAttackerColor()));

            return false;
        }

        // tries to evaluate defending snapshot
        boolean evaluatingAttacker = false; // used so that catching an error sends the correct isWhite value to handleEvaluationError()
        try {
            if (sentBattle.defendingStrategySnapshot != null) {
                defenderStockOverride = false;
                defendingSandbox = evaluateSourceCode(sentBattle.defendingStrategySnapshot, false, sentBattle);
            }
            else if (JAVASCRIPT_STOCK) {
                attackerStockOverride = false;
                evaluatingAttacker = true;
                String attackerSourceToUse = getRandomAIJS();
                sentBattle.attackingStrategySnapshot = attackerSourceToUse;
                attackingSandbox = evaluateSourceCode(attackerSourceToUse, true, sentBattle);
                evaluatingAttacker = false;
                String defenderSourceToUse = getRandomAIJS();
                sentBattle.defendingStrategySnapshot = defenderSourceToUse;
                defendingSandbox = evaluateSourceCode(defenderSourceToUse, false, sentBattle);
            }
            else {
                defenderStockOverride = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            // uses white to see if attacker is white, and black to see if attacker is black (and thus defender is white)
            Color colorToTest = evaluatingAttacker ? Color.WHITE : Color.BLACK;
            handleEvaluationError(sentBattle, colorToTest.equals(sentBattle.getAttackerColor()));

            return false;
        }

        return true;
    }

    // make a strategy lose if its source code cannot be evaluated properly,
    static void handleEvaluationError(Battle sentBattle, boolean isWhite) {
        System.out.println("evalError, isWhite: " + isWhite);
        String errorString = "ERROR - passed SourceCode has errors:\n";
        String stackTraceMessage = compressedExecutionTraceHolder[1];
        System.out.print(errorString + stackTraceMessage + "\n");
        sentBattle.addBattleGame();

        BattleGame newBattleGame = sentBattle.battleGames.get(0);
        newBattleGame.stackTrace += errorString + stackTraceMessage;

        // makes the other color win because this color had an invalid source
        processBattleGameWinner(sentBattle, newBattleGame, isWhite ? Color.BLACK : Color.WHITE);
        sentBattle.complete(false);
    }

    // runs a full battle
    static void runBattle(Battle sentBattle) {
        setupStrategies();

        Battle battle = sentBattle;

        while (numGames > 0) {
            // setup BattleGame
            BattleGame currentBattleGame = battle.addBattleGame();
            gameState = new GameState();

            Color gameWinner = playGame(battle, currentBattleGame);
            processBattleGameWinner(battle, currentBattleGame, gameWinner);

            if (CONSOLE_APP)
                System.out.println("Game Over ---- Launching next game...");

            numGames--;
        }
        int aWins = battle.getAttackerWins();
        int dWins = battle.getDefenderWins();
        System.out.printf("%s wins the Battle!  A-%d vs D-%d\n", aWins > dWins ? "ATTACKER" : "DEFENDER", aWins, dWins);

        // scan.close();
    }

    // creates the AI Strategy objects for the game to be played with
    static void setupStrategies() {
        if (DEMO_STOCK) {
            stockAttacker = new TrueRandomAI();
            stockDefender = new TrueRandomAI();
            return;
        }

        // sets up attacker
        if (mostlyCurrentBattle != null && attackerStockOverride)
            stockAttacker = getStockAI((UUID.fromString(mostlyCurrentBattle.attackingStrategyId)));
        else
            stockAttacker = new RandomAI();

        // sets up defender
        if (mostlyCurrentBattle != null && defenderStockOverride)
            stockDefender = getStockAI(UUID.fromString(mostlyCurrentBattle.defendingStrategyId));
        else if (manualPlayStockId != null)
            stockDefender = getStockAI(manualPlayStockId);
        else
            stockDefender = new RandomAI();

    }

    static boolean isIdStockId(UUID sentID) {
        IStrategy stockConversion = getStockAI(sentID);

        try {
            stockConversion = (TrueRandomAI)stockConversion;
        } catch (Exception e) {
            return true;
        }

        return false;
    }

    // gets a Java StockAI from a UUID
    static IStrategy getStockAI(UUID sentId) {
        if (sentId.equals(UUID.fromString("27961240-5173-4a3d-860e-d4f2b236d35c")))
            return new EasyAI();
        else if (sentId.equals(UUID.fromString("ff567412-30a5-444c-9ff8-437eda8a73a7")))
            return new MediumAI();
        else if (sentId.equals(UUID.fromString("ecce68c3-9ce0-466c-a7b5-5bf7affd5189")))
            return new HardAI();

        return new TrueRandomAI();
    }

    // runs testing suite before the scheduled battle
    // returns the testingSuiteResultString
    static String runTestingSuite(String strategySnapshot, String strategyId) {
        boolean isWhiteTurn;
        String[][] board;
        SimulationStepResponse result;

        // response format |<P/F>|<TestName>\n
        StringBuilder stringBuilder = new StringBuilder("");

        // test 1A
        board = new String[][]{
            {"00b1", "01b1", "", "", "", "", "", "", "02w1", "03w3"},
            {"04b3", "05b2", "", "", "", "", "", "", "06w2", "07w3"},
            {"08b2", "09b2", "", "", "", "", "", "", "10w2", "11w2"},
            {"12b1", "13b1", "", "", "", "", "", "", "14w1", "15w1"},
            {"16b4", "17b1", "", "", "", "", "", "", "18w1", "19w4"},
            {"20b4", "21b1", "", "", "", "", "", "", "22w1", "23w4"},
            {"24b1", "25b1", "", "", "", "", "", "", "26w1", "27w1"},
            {"28b2", "29b2", "", "", "", "", "", "", "30w2", "31w2"},
            {"32b3", "33b2", "", "", "", "", "", "", "34w2", "35w3"},
            {"36b3", "37b1", "", "", "", "", "", "", "38w1", "39w1"},
        };
        isWhiteTurn = true;
        result = runTest(board, isWhiteTurn, strategyId, strategySnapshot);
        boolean passedTest1A = !result.isGameOver;
        stringBuilder.append(getTestSuiteTestString("Takes first turn as White", passedTest1A));

        // test 1B
        board = new String[][]{
                {"00b1", "01b1", "", "", "", "", "", "", "02w1", "03w3"},
    {"04b3", "05b2", "", "", "", "", "", "", "06w2", "07w3"},
    {"08b2", "09b2", "", "", "", "", "", "", "10w2", "11w2"},
    {"12b1", "13b1", "", "", "", "", "", "", "14w1", "15w1"},
    {"16b4", "17b1", "", "", "", "", "", "", "18w1", "19w4"},
    {"20b4", "21b1", "", "", "", "23w4", "", "", "22w1", ""},
    {"24b1", "25b1", "", "", "", "", "", "", "26w1", "27w1"},
    {"28b2", "29b2", "", "", "", "", "", "", "30w2", "31w2"},
    {"32b3", "33b2", "", "", "", "", "", "", "34w2", "35w3"},
    {"36b3", "37b1", "", "", "", "", "", "", "38w1", "39w1"},
};
        isWhiteTurn = false;
        result = runTest(board, isWhiteTurn, strategyId, strategySnapshot);
        boolean passedTest1B = !result.isGameOver;
        stringBuilder.append(getTestSuiteTestString("Takes first turn as Black", passedTest1B));

        // test 2A
        board = new String[][] {
                {"", "", "", "", "", "", "", "", "02w1", ""},
    {"", "05b2", "01b1", "", "", "", "", "", "06w2", ""},
    {"00b1", "09b2", "", "", "", "", "", "", "10w2", "15w1"},
    {"12b1", "13b1", "", "", "", "", "", "", "14w1", "03w3"},
    {"04b3", "17b1", "08b2", "", "16b4", "19w4", "", "11w2", "18w1", "07w3"},
    {"32b3", "21b1", "28b2", "", "20b4", "23w4", "", "31w2", "22w1", "35w3"},
    {"36b3", "25b1", "", "", "", "", "", "", "26w1", "27w1"},
    {"24b1", "29b2", "", "", "", "", "", "", "30w2", "39w1"},
    {"", "33b2", "", "", "", "", "", "38w1", "34w2", ""},
    {"", "", "", "", "", "", "", "", "", "37b1"},
};
        isWhiteTurn = true;
        result = runTest(board, isWhiteTurn, strategyId, strategySnapshot);
        boolean passedTest2A = ("E5, A9").equals(result.moveString);
        stringBuilder.append(getTestSuiteTestString("Captures when in check as White", passedTest2A));

        // test 2B
        board = new String[][] {
                {"02w1", "", "", "", "", "", "", "", "", ""},
    {"", "05b2", "01b1", "", "", "", "", "", "06w2", ""},
    {"00b1", "09b2", "", "", "", "", "", "", "10w2", "15w1"},
    {"12b1", "13b1", "", "", "", "", "", "", "14w1", "03w3"},
    {"04b3", "17b1", "08b2", "", "16b4", "19w4", "", "11w2", "18w1", "07w3"},
    {"32b3", "21b1", "28b2", "", "20b4", "23w4", "", "31w2", "22w1", "35w3"},
    {"36b3", "25b1", "", "", "", "", "", "", "26w1", "27w1"},
    {"24b1", "29b2", "", "", "", "", "", "", "30w2", "39w1"},
    {"", "33b2", "", "", "", "", "", "38w1", "34w2", ""},
    {"", "37b1", "", "", "", "", "", "", "", ""},
};
        isWhiteTurn = false;
        result = runTest(board, isWhiteTurn, strategyId, strategySnapshot);
        boolean passedTest2B = ("F4, J0").equals(result.moveString);
        stringBuilder.append(getTestSuiteTestString("Captures when in check as Black", passedTest2B));

        // test 3A
        board = new String[][] {
                {"", "", "", "", "", "", "", "", "", ""},
    {"", "", "", "", "", "", "", "", "", ""},
    {"", "", "", "", "", "", "", "", "10w2", ""},
    {"", "", "", "", "", "", "", "", "06w2", ""},
    {"12b1", "", "", "", "16b4", "19w4", "", "11w2", "", ""},
    {"24b1", "", "", "", "20b4", "23w4", "", "31w2", "", ""},
    {"", "", "", "", "", "", "36b3", "", "", ""},
    {"", "", "", "", "", "", "", "", "", ""},
    {"", "", "", "", "", "", "", "", "", ""},
    {"", "", "", "", "", "", "", "", "", "39w1"},
};
        isWhiteTurn = true;
        result = runTest(board, isWhiteTurn, strategyId, strategySnapshot);
        boolean passedTest3A = ("A9, A8").equals(result.moveString);
        stringBuilder.append(getTestSuiteTestString("Dodges with final 1-piece as White", passedTest3A));

        // test 3B
        board = new String[][] {
                {"00b1", "", "", "", "", "", "", "", "", ""},
    {"", "", "", "", "", "", "", "", "", ""},
    {"", "", "", "", "", "", "", "", "", ""},
    {"", "", "", "03w3", "", "", "", "", "", ""},
    {"", "", "08b2", "", "16b4", "19w4", "", "", "", "15w1"},
    {"", "", "28b2", "", "20b4", "23w4", "", "", "", "27w1"},
    {"", "33b2", "", "", "", "", "", "", "", ""},
    {"", "29b2", "", "", "", "", "", "", "", ""},
    {"", "", "", "", "", "", "", "", "", ""},
    {"", "", "", "", "", "", "", "", "", ""},
};
        isWhiteTurn = false;
        result = runTest(board, isWhiteTurn, strategyId, strategySnapshot);
        boolean passedTest3B = ("J0, J1").equals(result.moveString);
        stringBuilder.append(getTestSuiteTestString("Dodges with final 1-piece as Black", passedTest3B));

        return stringBuilder.toString();
    }

    // get testingSuite test string
    static String getTestSuiteTestString(String testName, boolean passed) {
        return String.format("|%s|%s\n", passed ? "P" : "F", testName);
    }

    // runs a single given test of the testing suite
    static SimulationStepResponse runTest(String[][] board, boolean isWhiteTurn, String strategyId, String strategySnapshot) {
        initializeManualGameState(board, isWhiteTurn);
        String[][] reqIdlessBoard = deepCopyBoard(gameState.board);

        boolean errorInSource = false;
        // temp battle so processBattleStrategies can be used
        Battle tempBattle = new Battle(numGames, "No Attacker for Step Play", strategyId, null, strategySnapshot, null, null, false);

        // uses tempBattle's snapshot fields to set up fields for the attacking and defending strategies
        errorInSource = !processBattleStrategies(tempBattle);

        // resets execTrace and stackTrace
        compressedExecutionTraceHolder = new String[3];

        Color potentialWinner = null;
        if (!errorInSource) // only runs the turn if there isn't invalid source to run
            potentialWinner = playTurn(true, false, null, null);

        String[][] responseBoard = addPieceIds(board, reqIdlessBoard, isWhiteTurn);
        SimulationStepResponse resp = new SimulationStepResponse(responseBoard, lastMoveString,
                potentialWinner != null, Color.WHITE.equals(potentialWinner) != isWhiteTurn,
                strategyId);

        return resp;
    }

    // runs one game loop, from creating a fresh board to returning
    // the winner at the end of the game
    static Color playGame(Battle battle, BattleGame battleGame) {
        Color winner;
        if (CONSOLE_APP || DEBUG) {
            System.out.printf("Game Starting.  ATTACKER - %s\t\t DEFENDER - %s\n", battleGame.getAttackerColor(),
                    battleGame.getDefenderColor());
            if (CONSOLE_APP)
                waitms(3000);
            printBoard();
        }

        while (true) {
            Color potentialWinner = playTurn(false, false, battle, battleGame);
            if (potentialWinner != null) {
                winner = potentialWinner;
                break;
            }

            alternatePlayer();
        }

        System.out.printf("---------------- FINAL BOARD STATE (%d/%d)----------------", battleGame.getGameNumber(),
                battle.getIterations());
        printBoard();
        System.out.printf("%s Wins!!!\n", winner.name());

        return winner;
    }

    // plays a single turn of a game
    // returns the color of the winner, if there was one
    // isManualCom is whether or not this moveString is being acquired from a manual
    // test play window
    static Color playTurn(boolean isManualCom, boolean isManualStock, Battle battle, BattleGame battleGame) {
        // resets executionTrace Values
        compressedExecutionTraceHolder = new String[3];

        // fetch player move
        if (CONSOLE_APP)
            System.out.println(playerString(gameState.currentPlayer) + "'s turn");

        // for manual play, the player is the attacker,
        //     and for other stepped play (1 turn at a time), we treat the current sent strategy as the defender
        boolean isAttackerTurn = isManualCom ? false : currentColor().equals(battleGame.getAttackerColor());

        String moveString = isAttackerTurn
                ? getAttackerMoveString(isManualStock, compressedExecutionTraceHolder)
                : getDefenderMoveString(isManualStock, compressedExecutionTraceHolder);
        lastMoveString = moveString;

        if (!isManualCom) {
            // stores moveString in new turn, even if invalid
            battleGame.addTurn(battle.getId(), currentColor(), moveString, compressedExecutionTraceHolder[0], compressedExecutionTraceHolder[2]);
        }
        compressedExecutionTraceHolder[0] = "";
        compressedExecutionTraceHolder[2] = "";

        // validates move string
        boolean isValid = isMoveValid(moveString, gameState.board);
        if (!isValid) {
            String errorString = String.format("INVALID MOVE from %s: %s\n", playerString(gameState.currentPlayer), moveString);
            battleGame.stackTrace += errorString + compressedExecutionTraceHolder[1];
            if (DEBUG) {
                System.out.print(errorString);
                System.out.println("Move String must be in the form \"<fromCell>, \"<toCell>\"");
            }
            return getPlayerColor(gameState.getOpponent());
        }

        // process player move
        processMove(moveString);

        if (CONSOLE_APP || DEBUG)
            printBoard();

        // determines if game has been won
        Color potentialWinner = checkIfGameWon(battleGame);
        if (potentialWinner != null) {
            return potentialWinner;
        }

        return null;
    }

    // You can replace the contents of this function with the Attacker AI,
    // thus ignoring the Scanner for System.in
    //
    // Return string must be in the form "<fromCell>, <toCell>".
    // isManualCom is whether or not this moveString is being acquired from a manual
    // test play window
    static String getAttackerMoveString(boolean isManualStock, String[] compressedExecutionTraceHolder) {
        debugPrintln("Fetching attacker's move");
        if (ATTACKER_MANUAL)
            return scan.nextLine();

        // ATTACKER set to AI mode
        String moveString = "";
        try {
            // ATTACKER is a stock AI
            if (isManualStock || attackerStockOverride || (NO_COMMUNICATION && !JAVASCRIPT_STOCK)) {
                moveString = stockAttacker.getMove(gameState);// return processStrategySource(attackingEngine);
            } else { // ATTACKER is sent from backend
                moveString = processStrategySource(attackingSandbox, compressedExecutionTraceHolder);// attackingStrategy.getMove(gameState);
            }
        } catch (Exception e) {
            debugPrintf("Attacker Exception\n%s\n", e);
            appendStackTraceString(e.getMessage() + "\n" + e.getStackTrace());
            if (DEBUG)
                e.printStackTrace();
        }

        return moveString;
    }

    // appends to the currect stackTrace string
    static void appendStackTraceString(String newErrorString) {
        if (compressedExecutionTraceHolder[1] == null)
            compressedExecutionTraceHolder[1] = newErrorString;
        else if (("").equals(newErrorString))
            compressedExecutionTraceHolder[1] += newErrorString;
        else
            compressedExecutionTraceHolder[1] += "\n" + newErrorString;
    }

    // You can replace the contents of this function with the Defender AI,
    // thus ignoring the Scanner for System.in
    //
    // Return string must be in the form "<fromCell>, <toCell>".
    // isManualCom is whether or not this moveString is being acquired from a manual
    // test play window
    static String getDefenderMoveString(boolean isManualStock, String[] compressedExecutionTraceHolder) {
        debugPrintln("Fetching defender's move");
        if (DEFENDER_MANUAL)
            return scan.nextLine();

        // DEFENDER set to AI mode
        String moveString = "";
        try {
            // DEFENDER is a stock AI
            if (isManualStock || defenderStockOverride || (NO_COMMUNICATION && !JAVASCRIPT_STOCK)) {
                moveString = stockDefender.getMove(gameState);// return processStrategySource(defendingEngine);
            } else // DEFENDER is sent from backend
                moveString = processStrategySource(defendingSandbox, compressedExecutionTraceHolder);// defendingStrategy.getMove(gameState);
        } catch (Exception e) {
            debugPrintf("Defender Exception\n%s\n", e);
            appendStackTraceString(e.getMessage() + "\n" + e.getStackTrace());
            if (DEBUG)
                e.printStackTrace();
        }

        return moveString;
    }

    // evaluates source code for later fast running
    static /*ScriptEngine*/ NashornSandbox evaluateSourceCode(String originalStrategySource, boolean isAttacker, Battle battle) throws ScriptException, NoSuchMethodException, TimeoutException, ExecutionException, InterruptedException {
        // sets up evaluator
        String strategySource = originalStrategySource;
        //ScriptEngineManager factory = new ScriptEngineManager();
        //ScriptEngine engine = factory.getEngineByName("nashorn");
        NashornSandbox sandbox = NashornSandboxes.create();

        // scrubs out the PRINT_DELIMITER
        strategySource = strategySource.replace(PRINT_DELIMITER, "");

        // determines and sets the line num of getMove() within the battle object (ignoring comments)
        // ASSUMES that all user code will be below the getMove() declaration
        int indexOfGetMove = strategySource.indexOf("getMove()");

        // ends simulation if getMove() not found
        if (indexOfGetMove < 0) {
            String errorString = "ERROR: Cannot find getMove() function";
            appendStackTraceString(errorString);
            if (gameState == null)
                gameState = new GameState();
            throw new NoSuchMethodException(errorString);
        }

        int newLineIndex;
        int lineOfGetMove = 1;
        String lineCountingString = /*parseOutComments(*/strategySource.substring(0, indexOfGetMove)/*)*/;

        //System.out.println(lineCountingString);
        while ((newLineIndex = lineCountingString.indexOf("\n")) >= 0) {
            // counts the read newline character to determine what line getMove() starts on
            if (newLineIndex > 0 && !(newLineIndex == 1 && lineCountingString.charAt(0) == '}')) // skips blank lines or just closing braces
                lineOfGetMove++;

            //System.out.print((lineOfGetMove - 1) + ":  " + lineCountingString.substring(0, newLineIndex + 1));
            lineCountingString = lineCountingString.substring(newLineIndex + 1);
        }
        int lineOfGetMoveNoComments = lineOfGetMove;

        // determines and sets the line num of getMove() within the battle object (including comments)
        // ASSUMES that all user code will be below the getMove() declaration
        lineOfGetMove = 1;
        lineCountingString = strategySource.substring(0, indexOfGetMove);
        while ((newLineIndex = lineCountingString.indexOf("\n")) >= 0) {
            // counts the read newline character to determine what line getMove() starts on
            lineOfGetMove++;

            //System.out.print((lineOfGetMove - 1) + ":  " + lineCountingString.substring(0, newLineIndex + 1));
            lineCountingString = lineCountingString.substring(newLineIndex + 1);
        }

        // injects code so that "console.log()" is recognized and functions
        String injectedStrategySource = injectPrintingCode(strategySource);

        // sends the line numbers of getMove() to the battle object
        battle.setGetMoveLineNum(lineOfGetMove, isAttacker, lineOfGetMoveNoComments);

        // injects lineTrackingCode so each turn's executionTrace field can be properly set
        injectedStrategySource = injectLineTrackingCode(injectedStrategySource);
        battle.setInjectedSource(injectedStrategySource, isAttacker);
        strategySource = battle.getInjectedSource(isAttacker);
        //System.out.println("postInjection: " + strategySource);

        // evaluates the script
        //engine.eval(strategySource);
        sandbox.eval(strategySource);

        // perform test processing
        if (gameState == null)
            gameState = new GameState();
        String testProcessingResult = processStrategySource(sandbox, new String[] { "", "" });

        // only injects code if exception wasn't throw in in and by processStrategySource

        /*boolean erroredOut = testProcessingResult == null;

        if (erroredOut) {
            System.out.println("errored out");

        }
        else { */   // inject line tracking code
            //System.out.println("input: " + strategySource);
            //System.out.println("TEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\nTEST\n");
            battle.setupLineNumConversionList(isAttacker, strategySource);
            //System.out.println("\n\n\n\noutput: " + strategySource);
            //try {
                sandbox.eval(strategySource);
                processStrategySource(sandbox, compressedExecutionTraceHolder);
                String executionTrace = compressedExecutionTraceHolder[0];//sandbox.getSandboxedInvocable().invokeFunction(EXECUTION_TRACKER_FUNC_NAME).toString();
                //String rawExecutionTrace = executionTrace;
                //System.out.println("Executed Lines: " + executionTrace);
                //executionTrace = compressExecutionTraceCycles(executionTrace);
                //System.out.println("CompressedCycles: " + executionTrace);
                //executionTrace = compressExecutionTraceConsecutive(executionTrace);
                //System.out.println("Compressed: " + executionTrace);
                //rawExecutionTrace = getMinimalExecutionTrace(rawExecutionTrace);
                //System.out.println("Minimal: " + rawExecutionTrace);
            /*} catch (Exception e) {
                e.printStackTrace();
            }*/
        //}

        return sandbox;
    }

    // states for comment parsing
    enum CommentParseState { outsideComment, insideLineComment, insideblockComment, insideblockComment_noNewLineYet, insideString };
    enum CommentParseFunctionState { outsideFunction, insideFunction };

    // removes // and /* */ comments from a string
    static String parseOutComments(String code) {
        // TODO parse to remove comments from lineCountingString
        CommentParseState state = CommentParseState.outsideComment;

        StringBuilder result = new StringBuilder();
        Scanner s = new Scanner(code);
        s.useDelimiter("");

        CommentParseFunctionState[] functionStateHolder = { CommentParseFunctionState.outsideFunction };
        int[] numNestedBracesHolder = { 0 };

        while (s.hasNext()) {
            String c = getNextScannerChar(s, numNestedBracesHolder, functionStateHolder);
            switch (state) {
                case outsideComment:
                    if (c.equals("/") && s.hasNext()) {
                        String c2 = getNextScannerChar(s, numNestedBracesHolder, functionStateHolder);
                        if (c2.equals("/")) {
                            state = CommentParseState.insideLineComment;
                            appendCharIfNecessary(result, c, false, functionStateHolder[0]);
                            appendCharIfNecessary(result, c2, false, functionStateHolder[0]);
                        } else if (c2.equals("*")) {
                            state = CommentParseState.insideblockComment_noNewLineYet;
                            appendCharIfNecessary(result, c, false, functionStateHolder[0]);
                            appendCharIfNecessary(result, c2, false, functionStateHolder[0]);
                        } else {
                            appendCharIfNecessary(result, c, true, functionStateHolder[0]);
                            appendCharIfNecessary(result, c2, true, functionStateHolder[0]);
                        }
                    } else {
                        appendCharIfNecessary(result, c, true, functionStateHolder[0]);
                        if (c.equals("\"")) {
                            state = CommentParseState.insideString;
                        }
                    }
                    break;
                case insideString:
                    appendCharIfNecessary(result, c, true, functionStateHolder[0]);
                    if (c.equals("\"")) {
                        state = CommentParseState.outsideComment;
                    } else if (c.equals("\\") && s.hasNext()) {
                        appendCharIfNecessary(result, getNextScannerChar(s, numNestedBracesHolder, functionStateHolder), true, functionStateHolder[0]);
                    }
                    break;
                case insideLineComment:
                    if (c.equals("\n")) {
                        state = CommentParseState.outsideComment;
                        appendCharIfNecessary(result, c, true, functionStateHolder[0]);
                    }
                    else
                        appendCharIfNecessary(result, c, false, functionStateHolder[0]);
                    break;
                case insideblockComment_noNewLineYet:
                    if (c.equals("\n")) {
                        appendCharIfNecessary(result, c, true, functionStateHolder[0]);
                        state = CommentParseState.insideblockComment;
                    }
                    else
                        appendCharIfNecessary(result, c, false, functionStateHolder[0]);
                case insideblockComment:
                    appendCharIfNecessary(result, c, false, functionStateHolder[0]);
                    while (c.equals("*") && s.hasNext()) {
                        String c2 = getNextScannerChar(s, numNestedBracesHolder, functionStateHolder);
                        appendCharIfNecessary(result, c2, false, functionStateHolder[0]);
                        if (c2.equals("/")) {
                            state = CommentParseState.outsideComment;
                            break;
                        }
                    }
            }
        }
        s.close();
        return result.toString();
    }

    // used for parseOutComments() to only not remove comments if outside of curly braces
    static void appendCharIfNecessary(StringBuilder result, String scannerChar, boolean notPartOfComment, CommentParseFunctionState functionState) {
        if (notPartOfComment || functionState.equals(CommentParseFunctionState.insideFunction))
            result.append(scannerChar);
    }

    // used for parseOutComments() to get the next char in the stream, tracking the number of nested curly braces
    static String getNextScannerChar(Scanner s, int[] numNestedBracesHolder, CommentParseFunctionState[] functionStateHolder) {
        String nextChar = s.next();
        // TODO make function detection only work after "function" is read
        if (nextChar.equals("{")) {
            numNestedBracesHolder[0]++;

            if (functionStateHolder[0].equals(CommentParseFunctionState.outsideFunction))
                functionStateHolder[0] = CommentParseFunctionState.insideFunction;
        }
        else if (nextChar.equals("}")) {
            numNestedBracesHolder[0]--;

            if (numNestedBracesHolder[0] <= 0 && functionStateHolder[0].equals(CommentParseFunctionState.insideFunction))
                functionStateHolder[0] = CommentParseFunctionState.outsideFunction;
        }

        return nextChar;
    }

    // inject printing code (accessed through console.log())
    static String injectPrintingCode(String strategySource) {
        return  "function Console () {\n" +
                "    this.log = function(printString) {\n" +
                "        " + EXECUTION_TRACKER_VAR_NAME + " += printString" + "+ \"" + PRINT_DELIMITER + "\"" + ";\n" +
                "    };\n" +
                "};\n" +
                "var console = new Console();\n\n" +
                strategySource;
    }

    // injects a line of code after every possible line of user code to track the lines that have been executed in a given turn
    static String injectLineTrackingCode(String strategySource) {
        // the resulting string with injected code
        String result = "";

        // the unprocessed portion of the strategy source
        String workingString = strategySource;

        // track what the current working string matches
        boolean hasAnEndLine;
        boolean hasAnotherLine;
        boolean cannotInjectLine;

        // determines the starting line number so the proper execution tracking line can be injected
        // ASSUMES that all user code will be below the getMove() declaration
        int indexOfGetMove = workingString.indexOf("getMove()");
        int currentLineNum = 1; // starts at 1 because this is how line numbering is
        int newLineIndex;

        // starts the line counting with the line after getMove()
        result += workingString.substring(0, indexOfGetMove);
        workingString = workingString.substring(indexOfGetMove);
        int indexOfLineAfterGetMove = workingString.indexOf("\n") + 1;
        result += workingString.substring(0, indexOfLineAfterGetMove);
        workingString = workingString.substring(indexOfLineAfterGetMove);
        currentLineNum++; // so it starts after getMove() line
        //currentLineNum = lineOfGetMove;

        // defines patterns to match intermediate strings against
        String endingString = ".*";
        Pattern hasAnotherLinePattern = Pattern.compile(".*[^ }\\n\\t]+" + endingString, Pattern.DOTALL);
        String structureDetectionString = "\\A[ \\t]*(if|for|switch|while)[ \\t\\n]*\\([^\\n]*\\)";
        Pattern hasStructurePattern = Pattern.compile(structureDetectionString + endingString, Pattern.DOTALL);
        Pattern hasCommentedBraceAfterStructurePattern = Pattern.compile(structureDetectionString + "[ \\t]*//[^\\n]*\\{" + endingString, Pattern.DOTALL);
        Pattern hasClosedStructureDiffLineNoCommentPattern = Pattern.compile(structureDetectionString + "[ \\t\\n]*\\n*[ \\t\\n]*\\{" + endingString, Pattern.DOTALL);
        Pattern hasClosedStructureInSameLinePattern = Pattern.compile(structureDetectionString + "[^\\n]*\\{" + endingString, Pattern.DOTALL);
        Pattern hasReturnStatement = Pattern.compile(("\\A[ \\t]*return[ \\t][^\\n]+;.*"), Pattern.DOTALL);

        Pattern hasPureConditionalStructurePattern = Pattern.compile("\\A[ \\t]*(if|while).*", Pattern.DOTALL);
        Pattern hasImpureConditionalStructurePattern = Pattern.compile("\\A[ \\t]*switch.*", Pattern.DOTALL);
        Pattern hasFlowJumpPattern = Pattern.compile(("\\A[ \\t]*(break|continue);.*"), Pattern.DOTALL);
        Pattern hasForLoopPattern = Pattern.compile(("\\A[ \\t]*for[ \\t\\n]*\\([^;]*;[^;]+;[^;]*\\).*"), Pattern.DOTALL);

        boolean shouldCloseAfterNextLine = false;

        do {
            cannotInjectLine = false;

            // tries to find where a newline character is
            newLineIndex = workingString.indexOf("\n");
            hasAnEndLine = newLineIndex >= 0;//workingString.matches("(.*)\n");

            // determines where the current line ends
            int indexAfterCurrentLine = hasAnEndLine ? (newLineIndex + 1) : workingString.length();

            // splits working string into [currentLine + workingString]
            String currentLine = workingString.substring(0, indexAfterCurrentLine);
            String prevWorkingString = workingString;
            workingString = workingString.substring(indexAfterCurrentLine);

            // determines if the current line cannot be injected after
            Matcher structureMatcher = hasStructurePattern.matcher(prevWorkingString);
            //"[ \t]*(if|for|switch|while)[ \t\n]*"
            boolean hasStructure = structureMatcher.matches();
            boolean hasPureConditionalStructure = hasPureConditionalStructurePattern.matcher(prevWorkingString).matches();
            boolean hasImpureConditionalStructure = hasImpureConditionalStructurePattern.matcher(prevWorkingString).matches();
            //if (hasStructure)
            //    System.out.println("struc: " + prevWorkingString.substring(structureMatcher.start(), structureMatcher.end()));
            boolean hasCommentedBraceAfterStructure = hasStructure && hasCommentedBraceAfterStructurePattern.matcher(prevWorkingString).matches();
            boolean hasClosedStructureInSameLine = hasStructure && hasClosedStructureInSameLinePattern.matcher(prevWorkingString).matches();
            boolean hasClosedStructureDiffLineNoComment = hasStructure && hasClosedStructureDiffLineNoCommentPattern.matcher(prevWorkingString).matches();
            boolean hasFlowJump = hasFlowJumpPattern.matcher(currentLine).matches();
            Matcher hasForLoopMatcher = hasForLoopPattern.matcher(prevWorkingString);
            cannotInjectLine = hasStructure && ((hasClosedStructureInSameLine && hasCommentedBraceAfterStructure) || !(hasClosedStructureDiffLineNoComment || hasClosedStructureInSameLine));

            String closingBrace = "";

            // code to inject w/out semicolon or surrounding conditional content
            String codeToInject = String.format("%s += \"%d, \"", EXECUTION_TRACKER_VAR_NAME, currentLineNum);
            int indexOfOpenParenthesis = currentLine.indexOf("(");

            if (hasPureConditionalStructure)
                currentLine = String.format(currentLine.substring(0, indexOfOpenParenthesis + 1) + "(%s) != null && " + currentLine.substring(indexOfOpenParenthesis + 1), codeToInject);
            else if (hasForLoopMatcher.matches()) {
                int loopConditionalStart = prevWorkingString.indexOf(";");
                currentLine = String.format(currentLine.substring(0, loopConditionalStart + 1) + "(%s) != null && " + currentLine.substring(loopConditionalStart + 1), codeToInject);
            }

            if (shouldCloseAfterNextLine) {
                closingBrace = "}";
                shouldCloseAfterNextLine = false;
                cannotInjectLine = false;
            }
            else if (cannotInjectLine) {
                Matcher matcher = Pattern.compile(structureDetectionString, Pattern.DOTALL).matcher(currentLine);
                boolean matchFound = matcher.find();
                /*MatchResult matchResult = matcher.toMatchResult();
                int numGroups = matchResult.groupCount();*/
                //System.out.println(numGroups + "    " + matchResult.groupCount());*/
                //matchResult = matcher.toMatchResult();
                //..System.out.println(matcher.groupCount() + "    " + matcher.);
                int structureEndIndex = matcher.end(0);
                String newCurrentLineString = currentLine.substring(0, structureEndIndex + 1) + " {" + currentLine.substring((structureEndIndex + 1));
                //System.out.println(newCurrentLineString);
                currentLine = newCurrentLineString;
                shouldCloseAfterNextLine = true;
            }
            // injects the line, if possible

            // this "flag" can be toggled to enable injection of execution tracking code in the first line within a structure
            final boolean shouldTrackStructuresWhenExecutingWithin = false;

            // determine if there is valuable content in this current line or in the remaining code
            Matcher matcher = hasAnotherLinePattern.matcher(workingString);
            hasAnotherLine = matcher.matches();
            boolean hasContentInThisLine = hasAnotherLinePattern.matcher(currentLine).matches();

            codeToInject = "\t\t\t" + codeToInject + ";\n";
            if (hasStructure && !shouldTrackStructuresWhenExecutingWithin/*cannotInjectLine*/) {
                if (hasImpureConditionalStructure)
                    result += codeToInject + currentLine;
                else
                    result += currentLine;
            }
            else // always inject a line //if (hasFlowJump || hasReturnStatement.matcher(prevWorkingString).matches() || hasContentInThisLine)
                result += codeToInject + currentLine;
            /*else if (hasContentInThisLine)// injects code after current line
                result += currentLine + codeToInject;*/
            /*else
                result += currentLine;*/

            result += closingBrace;

            // tracks the current line number so the proper execution tracking line can be injected
            currentLineNum++;

            // test printing
            /*System.out.println(String.format("\nmatchTest: %s hasAnotherLine? %b    hasStruc? %b    hasStrucComment? %b    hasCloseSameLine? %b    hasCloseDiffLine? %b",
                    prevWorkingString, hasAnotherLine, hasStructure, hasCommentedBraceAfterStructure, hasClosedStructureInSameLine, hasClosedStructureDiffLineNoComment));
                    *///"\nmatchTest: " + prevWorkingString + " matches? " + hasAnotherLine + /*"\ncurrentLine:" + currentLine +*/ " hasUnclosedStructure? " + cannotInjectLine);
        } while (hasAnotherLine); // has another line with actual content

        // appends any missed characters
        result += workingString;

        // inject function to retrieve lineTrace (JavaScript)
        result += "\nfunction " + EXECUTION_TRACKER_FUNC_NAME + "() {\n" +
                "    return " + EXECUTION_TRACKER_VAR_NAME + ";\n" +
                "}";

        return result;
    }

    static String compressExecutionTraceCycles(String executionTrace) {
        String result = "";
        StringBuilder builderResult = new StringBuilder("");

        // compresses cycles of code ranges
        ArrayList<ArrayList<String>> lineStringsToCheck = new ArrayList<>();
        String[] lineStringSplit = executionTrace.split(", ");
        String[] lineStringSplitNoPrint = new String[lineStringSplit.length];

        // printInfo is in the form <optionalLineCapWarning>█<indexInUncompressedExecutionTrace>█<printedString>█<indexInUncompressedExecutionTrace>█<printedString>█ ...
        String printInfo = "";
        final int PRINT_LINE_CAP = 1000;
        int numPrintLines = 0;
        // populates lineStringsToCheck
        for (int i = 0; i < lineStringSplit.length; i++) {
            String curLineString = lineStringSplit[i];

            // parses out print info
            String[] printInfoSplit = curLineString.split(PRINT_DELIMITER);
            //System.out.println("curLineString: " + curLineString);
            for (int j = 0; j < printInfoSplit.length; j++) {
                String curSplit = printInfoSplit[j];
                if (j == printInfoSplit.length - 1) {
                    curLineString = curSplit;
                    //System.out.println("convertedTo: " + curLineString);
                } else {
                    // don't print if the cap has been reached
                    if (numPrintLines >= PRINT_LINE_CAP)
                        continue;

                    if (j == 0)
                        printInfo += (i - 1) + PRINT_DELIMITER;

                    printInfo += curSplit + PRINT_DELIMITER + "\n";
                    numPrintLines++;
                }
            }

            int curLineNum = Integer.parseInt(curLineString);

            int lineStringIndex = getlineStringIndexInLineStringsList(curLineString, lineStringsToCheck);
            if (lineStringIndex < 0) {
                lineStringsToCheck.add(new ArrayList<>());
                lineStringIndex = lineStringsToCheck.size() - 1;
                lineStringsToCheck.get(lineStringIndex).add(curLineString);
            }

            lineStringsToCheck.get(lineStringIndex).add(i + "");

            lineStringSplitNoPrint[i] = curLineString;
        }

        /*System.out.print("ExecutedLines: ");
        System.out.print(lineStringSplitNoPrint[0]);
        for (int i = 1; i < lineStringSplitNoPrint.length; i++)
            System.out.print("|" + lineStringSplitNoPrint[i]);
        System.out.println("");*/

        String optionalLineCapWarning = (numPrintLines >= PRINT_LINE_CAP) ? "WARNING: console.log() lines capped at " + PRINT_LINE_CAP + " per turn" : "";
        compressedExecutionTraceHolder[2] = optionalLineCapWarning + PRINT_DELIMITER + printInfo;

        // prints lineStringsList
        /*String printString = "";
        for (int i = 0; i < lineStringsToCheck.size(); i++) {
            printString += "{ ";

            for (int j = 0; j < lineStringsToCheck.get(i).size(); j++)
                printString += lineStringsToCheck.get(i).get(j) + ", ";

            printString += "} \n";
        }*/
        //System.out.println(printString);

        // detects cycles
        PriorityQueue<CycleInfo> cycleInfoHeap = new PriorityQueue<>();
        // looks for cycles that start with the line number stored in lineStringsToCheck.get(i).
            // this is unique in the lineStringsToCheck list
        for (int i = 0; i < lineStringsToCheck.size(); i++) {
            ArrayList<String> curSubList = lineStringsToCheck.get(i);

            // doesn't check subLists that only have the head node
            if (curSubList.size() <= 1)
                continue;

            // checks for cycles in the sublist for every possible spacing
            for (int spacing = 1; spacing < curSubList.size() - 1; spacing++) {
                // iterates through the current sublist to determine potential cycles based on spacing of length spacing
                int leftIndex = -1;
                for (int j = 1 + spacing; j < curSubList.size(); j++) {
                    if (leftIndex < 0)
                        leftIndex = Integer.parseInt(curSubList.get(j - spacing));

                    // see how many cycle repetitions there are
                    int numCycleRepititions = 1;
                    for (int k = leftIndex + spacing; k < lineStringSplitNoPrint/*lineStringSplit*/.length; k += spacing) {
                        boolean foundCycle = doesWindowHoldExpectedCycle(lineStringSplitNoPrint/*lineStringSplit*/, leftIndex, k, spacing);

                        if (!foundCycle)
                            break;

                        numCycleRepititions++;
                    }

                    if (numCycleRepititions > 1) {
                        CycleInfo newCycleInfo = new CycleInfo(lineStringSplitNoPrint/*lineStringSplit*/, numCycleRepititions, leftIndex, spacing);
                        cycleInfoHeap.add(newCycleInfo);

                        leftIndex = newCycleInfo.lastCycleEndIndex + 1;
                    }
                    else
                        leftIndex += spacing;
                }
            }
        }

        String[] cycledStringArray = lineStringSplitNoPrint/*lineStringSplit*/.clone();
        // replaces lineStrings in the array with the
        ArrayList<CycleInfo> usedCycleInfos = new ArrayList<>();
        while (!cycleInfoHeap.isEmpty()) {
            CycleInfo curInfo = cycleInfoHeap.remove();
            String curLineString = cycledStringArray[curInfo.firstCycleStartIndex];
            //System.out.println("examined cycleCompressed " + curInfo.firstCycleStartIndex + ":" + curInfo.lastCycleEndIndex + "    " + curInfo.getCompressedCycleString());

            // continue if compressing at least 2 iterations would overlap with an edge of another compression
            boolean containsCompressedInfo = false;
            boolean cycleStartsMatch = false;
            boolean cycleEndsMatch = false;
            for (int i = curInfo.firstCycleStartIndex; i <= curInfo.lastCycleEndIndex; i++) {
                String curString = cycledStringArray[i];

                if (curString.contains(CycleInfo.REPETITION_START_CHAR) || curString.contains(CycleInfo.REPETITION_END_CHAR) || curString.equals("")) {
                    boolean cycleStartsMatchJustOccurred = (i == curInfo.firstCycleStartIndex && curString.contains(CycleInfo.REPETITION_START_CHAR));
                    cycleStartsMatch = cycleStartsMatch || cycleStartsMatchJustOccurred;
                    cycleEndsMatch = (i == curInfo.lastCycleEndIndex && curString.contains(CycleInfo.REPETITION_END_CHAR));

                    // if this cycle is touching, but not overlapping with an end of another, larger, encompassing cycle, allow this cycle
                    if (cycleEndsMatch) {
                        //System.out.println("cycleEndsMatch");
                        break;
                    } else if (cycleStartsMatchJustOccurred) {
                        //System.out.println("cycleStartsMatch");
                        continue;
                    }

                    // retry this cycle later with a size that won't overlap, if possible
                    int numRepetitionsTested = (i - curInfo.firstCycleStartIndex) / curInfo.cycleLength;
                    int numRepetitionsRemaining = (curInfo.lastCycleEndIndex - i) / curInfo.cycleLength;
                    if (i > curInfo.secondCycleEndIndex) {
                        //int numActualFullReps = (i - curInfo.firstCycleStartIndex) / curInfo.cycleLength;
                        cycleInfoHeap.add(new CycleInfo(curInfo.cycleStringArr, numRepetitionsTested, curInfo.firstCycleStartIndex, curInfo.cycleLength));
                        //System.out.print("examined cycleCompressed " + curInfo.firstCycleStartIndex + ":" + curInfo.lastCycleEndIndex + "    " + curInfo.getCompressedCycleString() + "          ");
                        //System.out.println("retrying w/ left reps: x" + numRepetitionsTested);
                    }
                    if (numRepetitionsRemaining > 1) {
                        int newStartIndex = curInfo.firstCycleStartIndex + curInfo.cycleLength * (numRepetitionsTested + 1);
                        cycleInfoHeap.add(new CycleInfo(curInfo.cycleStringArr, numRepetitionsRemaining, newStartIndex, curInfo.cycleLength));
                        //System.out.print("examined cycleCompressed " + curInfo.firstCycleStartIndex + ":" + curInfo.lastCycleEndIndex + "    " + curInfo.getCompressedCycleString() + "          ");
                        //System.out.println("retrying w/ right reps: x" + numRepetitionsRemaining);
                    }

                    //System.out.println("cycle overlapped");
                    containsCompressedInfo = true;
                    break;
                }
            }
            if (containsCompressedInfo)
                continue;

            //System.out.println("using cycleCompressed " + curInfo.firstCycleStartIndex + ":" + curInfo.lastCycleEndIndex);

            String curStart = lineStringSplitNoPrint/*lineStringSplit*/[curInfo.firstCycleStartIndex];
            String curEnd = lineStringSplitNoPrint/*lineStringSplit*/[curInfo.lastCycleEndIndex];
            int firstCycleEndIndex = curInfo.firstCycleStartIndex + curInfo.cycleLength - 1;
            if (cycleStartsMatch) {
                cycledStringArray[curInfo.firstCycleStartIndex] = curInfo.getStartString(cycledStringArray[curInfo.firstCycleStartIndex]);
                //System.out.println("cycleStartsMatching");
            } else
                cycledStringArray[curInfo.firstCycleStartIndex] = curInfo.getStartString(curStart); //curInfo.getCompressedCycleString();
            cycledStringArray[firstCycleEndIndex] = curInfo.getEndString(curEnd);
            if (cycleEndsMatch) {
                cycledStringArray[curInfo.lastCycleEndIndex] = curInfo.getEndStringLineNumDeletion(cycledStringArray[curInfo.lastCycleEndIndex]);
            } else
                cycledStringArray[curInfo.lastCycleEndIndex] = "";

            for (int i = firstCycleEndIndex + 1; i < curInfo.lastCycleEndIndex; i++) {
                cycledStringArray[i] = "";
            }

            usedCycleInfos.add(curInfo);
        }

        // prints out the compressed cycle strings
        String prevString = null;
        for (int i = 0; i < cycledStringArray.length; i++) {
            String curString = cycledStringArray[i];

            // ignores this string for printing
            if (curString.equals("") || curString.equals(CycleInfo.REPETITION_END_CHAR))
                continue;

            // prints the previous string
            if (prevString != null)
                builderResult.append(prevString);

            // don't print delimiter if this is a consecutive cycle start or consecutive cycle end
            if (prevString != null && !((prevString.equals(CycleInfo.REPETITION_START_CHAR) && curString.contains(CycleInfo.REPETITION_START_CHAR))
                    || (prevString.contains(CycleInfo.REPETITION_END_CHAR) && curString.contains(CycleInfo.REPETITION_END_CHAR) && curString.indexOf(CycleInfo.REPETITION_END_CHAR) == 0)))
                builderResult.append(CycleInfo.DELIMITER);

            // prints the end of the resulting string
            if (i == cycledStringArray.length - 1) {
                builderResult.append(curString + CycleInfo.DELIMITER);
                break;
            }

            prevString = curString;
        }

        result = builderResult.toString();
        //System.out.println("CompressedCycles: " + result);
        return result;
    }

    static boolean doesWindowHoldExpectedCycle(String[] lineNumArray, int referenceIndex, int testIndex, int windowSize) {
        // verifies that a cycle has been found
        for (int offset = 0; offset < windowSize; offset++) {
            if (!lineNumArray[referenceIndex + offset].equals(lineNumArray[testIndex + offset]))
                return false;
        }

        return true;
    }

    static String compressExecutionTraceConsecutive(String executionTrace) {
        String result = "";
        StringBuilder builderResult = new StringBuilder("");

        // compresses consecutive code ranges
        String workingString = executionTrace;
        int prevLineNum = -5;
        int chainStartLineNum = -5;
        while (true) {
            int nextDelimiterIndex = workingString.indexOf(CycleInfo.DELIMITER/*", "*/);
            if (nextDelimiterIndex < 0)
                break;

            int delimiterLength = CycleInfo.DELIMITER.length();
            String curLineString = workingString.substring(0, nextDelimiterIndex);
            workingString = workingString.length() > nextDelimiterIndex + delimiterLength - 1 ? workingString.substring(nextDelimiterIndex + delimiterLength) : "";

            int curLineNum;
            boolean startingOrEndingCycle = false;
            String cycleStringNoDigits = "";
            //try {
            // removes {<splitArrIndex>} if there
                int cycleOpenIndex = -1;
                int cycleCloseIndex = curLineString.indexOf(CycleInfo.REPETITION_END_CHAR);

                String adjustedIntString = curLineString;
                int curCycleOpenIndex;
                String curCycleStartString = curLineString;
                while ((curCycleOpenIndex = curCycleStartString.indexOf(CycleInfo.REPETITION_START_CHAR)) >= 0) {
                    adjustedIntString = curCycleStartString.substring(curCycleOpenIndex + 1);
                    cycleStringNoDigits += curCycleStartString.substring(0, curCycleOpenIndex + 1);
                    curCycleStartString = adjustedIntString;
                    startingOrEndingCycle = true;
                    cycleOpenIndex = curCycleOpenIndex;
                }
                if (cycleCloseIndex >= 0) {
                    adjustedIntString = curLineString.substring(0, cycleCloseIndex);
                    cycleStringNoDigits = curLineString.substring(cycleCloseIndex);
                    startingOrEndingCycle = true;
                }
                //curLineNumFromCycle = Integer.parseInt(adjustedIntString);

                curLineNum = Integer.parseInt(adjustedIntString);
            /*} catch (Exception e) {
                curLineNum = -5;
            }*/

            if (chainStartLineNum >= 0 && (curLineNum != prevLineNum + 1 || workingString.length() <= 0 || startingOrEndingCycle)) {
                if (cycleCloseIndex >= 0 && prevLineNum - chainStartLineNum > 1) {
                    if (curLineNum == prevLineNum + 1)
                        builderResult.append(chainStartLineNum + "-");
                    else
                        builderResult.append(chainStartLineNum + "-" + prevLineNum + CycleInfo.DELIMITER);
                }
                else {
                    if (prevLineNum - chainStartLineNum > 1)
                        builderResult.append(/*"[" + */chainStartLineNum + "-" + prevLineNum + CycleInfo.DELIMITER/* + "], "*/);// + curLineString + ", ");
                    else if (cycleCloseIndex > 0 && curLineNum - chainStartLineNum > 1 && curLineNum - prevLineNum == 1) {
                        String stringToInsert = chainStartLineNum + "-";
                        builderResult.append(stringToInsert);
                        //System.out.println("ofInterest: " + stringToInsert);
                    }
                    else {
                        builderResult.append(chainStartLineNum + CycleInfo.DELIMITER/*", "*/);

                        if (prevLineNum >= 0)
                            builderResult.append(prevLineNum + CycleInfo.DELIMITER/*", "*/);
                    }
                }

                chainStartLineNum = -5;
            }
            else if (prevLineNum >= 0 && (curLineNum != prevLineNum + 1 || workingString.length() <= 0 || startingOrEndingCycle)) {
                builderResult.append(prevLineNum + CycleInfo.DELIMITER/*", "*/);
            }
            else if (curLineNum == prevLineNum + 1 && !startingOrEndingCycle) {
                if (chainStartLineNum < 0)
                    chainStartLineNum = prevLineNum;
            }

            if (workingString.length() <= 0) {
                builderResult.append(curLineString /*+ CycleInfo.DELIMITER*//*", "*/);
                break;
            }
            else if (/*curLineNum < 0 ||*/ cycleStringNoDigits.length() > 0 /*startingOrEndingCycle*/) {
                if (cycleCloseIndex >= 0) {
                    builderResult.append(curLineString + CycleInfo.DELIMITER);
                    curLineNum = -5;
                }
                else
                    builderResult.append(cycleStringNoDigits/* + CycleInfo.DELIMITER*//*", "*/);
            }

            prevLineNum = curLineNum;
        }

        result = builderResult.toString();
        //System.out.println("Compressed: " + result);

        return result;
    }

    // only used for compressExecutionTrace
    static int getlineStringIndexInLineStringsList(String lineString, ArrayList<ArrayList<String>> lineStringsList) {
        for (int i = 0; i < lineStringsList.size(); i++) {
            if (lineString.equals(lineStringsList.get(i).get(0)))
                return i;
        }

        return -1;
    }

    static String getMinimalExecutionTrace(String executionTrace) {
        String result = "";
        StringBuilder builderResult = new StringBuilder("");
        String[] splitArr = executionTrace.split(", ");
        int[] splitIntArr = new int[splitArr.length];
        for (int i = 0; i < splitArr.length; i++) {
            try {
                splitIntArr[i] = Integer.parseInt(splitArr[i]);
            } catch (Exception e) { }
        }

        Arrays.sort(splitIntArr);

        int prevLineNum = -1;
        for (int i = 0; i < splitIntArr.length; i++) {
            int curLineNum = splitIntArr[i];
            if (curLineNum < 0)
                break;

            if (curLineNum != prevLineNum)
                builderResult.append(curLineNum + ", ");//result += curLineString + ", ";

            prevLineNum = curLineNum;
        }

        result = builderResult.toString();
        //System.out.println("Minimal: " + result);
        return result;
    }

    // gets a moveString from evaluating the strategy's source code
    static String processStrategySource(/*ScriptEngine strategyEngine*/ NashornSandbox strategySandbox, String[] compressedExecutionTraceHolder) throws ScriptException, NoSuchMethodException, TimeoutException, ExecutionException, InterruptedException {
        final String TIMEOUT_ERROR_STRING = "ThisInvokeCallToGetMove()TimedOut";
        String result = TIMEOUT_ERROR_STRING;
        String execTrace = "";

        // for JS parsing
        // allows the strategy's source code to access the gameState as a global
        // variable
        //strategyEngine.put("gameState", gameState);
        strategySandbox.inject("gameState", gameState);
        strategySandbox.inject(EXECUTION_TRACKER_VAR_NAME, "");

        // invokes the script function to get moveString
        try {
            // String script = "function getMove() { return 'A8, A7' }";

            // engine.eval(strategySource/*script*/);

            Invocable inv = strategySandbox.getSandboxedInvocable(); //(Invocable) strategyEngine;

            /*final Duration timeout = Duration.ofMillis(1000);
            ExecutorService executor = Executors.newSingleThreadExecutor();
            final Future<String> handler = executor.submit(new GetMoveCallable(inv));
            try {
                result = handler.get(timeout.toMillis(), TimeUnit.MILLISECONDS);
            } catch (TimeoutException e) {
                handler.cancel(true);
                executor.shutdownNow();
                throw new TimeoutException("ERROR: Execution of getMove() timed out.  This may be due to an infinite loop.");
            }

            executor.shutdownNow();*/

            result = "" + inv.invokeFunction("getMove");

            try {
                execTrace = "" + inv.invokeFunction(EXECUTION_TRACKER_FUNC_NAME);
                //System.out.println("\nExecutedLines: " + execTrace);
                String rawExecutionTrace = execTrace;
                execTrace = compressExecutionTraceCycles(execTrace);
                //System.out.println("CompressedCycles: " + execTrace);
                execTrace = compressExecutionTraceConsecutive(execTrace);
                //System.out.println("Compressed: " + execTrace);
                rawExecutionTrace = getMinimalExecutionTrace(rawExecutionTrace);
                //System.out.println("Minimal: " + rawExecutionTrace);
            } catch (NoSuchMethodException ex) {
                System.out.println("ERROR: " + EXECUTION_TRACKER_FUNC_NAME + "() not properly added to source");
            }
        } catch (Exception e) {
            String errorString = "ERROR: Runtime Error";
            result = errorString;
            appendStackTraceString(errorString);
            appendStackTraceString(e.getMessage() + "\n" + e.getStackTrace());

            // throws the exception again so the game can be ended immediately
            throw e;
        }

        compressedExecutionTraceHolder[0] = execTrace;

        return result;
    }

    // adjusts the gameState based upon the moveString
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
        debugPrintf("Move String: \"%s\"\nMoving [%d][%d] (%s) to [%d][%d] (%s)\n", moveString, fromCol, fromRow,
                fromPiece, toCol, toRow, toPiece);

        // copies piece to new location
        if (fromMoveDistance > toMoveDistance) { // attacker wins
            board[toCol][toRow] = board[fromCol][fromRow];
            processLosePiece(toColor, toMoveDistance);
        } else if (fromMoveDistance == toMoveDistance) // both pieces die upon a tie
        {
            board[toCol][toRow] = "";
            processLosePiece(fromColor, fromMoveDistance);
            processLosePiece(toColor, toMoveDistance);
        } else // if (fromMoveDistance < toMoveDistance) // defender wins
            processLosePiece(fromColor, fromMoveDistance);

        // removes piece from old location
        board[fromCol][fromRow] = "";

        gameState.numMovesMade++;
    }

    static boolean isPlayerInCheck(Color color, String[][] board) {
        boolean isWhite = color.equals(Color.WHITE);
        int rowToCheck = isWhite ? 9 : 0;
        String opponentOnePiece = isWhite ? "b1" : "w1";

        for (int i = 0; i < BOARD_LENGTH; i++) {
            if (board[i][rowToCheck].equals(opponentOnePiece))
                return true;
        }

        return false;
    }

    // determines if the last player has just won the game
    // returns the color of the winner, if there was one
    public static Color checkIfGameWon(BattleGame battleGame) {
        // end game if all of a player's pawns are captured
        if (gameState.numWhitePawns == 0) { // if white has lost all their pawns
            // white can only win in this situation if they initiated a move that captured
            // their opponents final pawn, as well as theirs simultaneously
            if (gameState.numBlackPawns == 0 && gameState.currentPlayer == gameState.WHITE) {
                debugPrintln("WHITE has captured all pawns in the game");
                return Color.WHITE;
            } else // otherwise, white losing all their pawns is a loss for white
            {
                debugPrintln("WHITE has no more pawns");
                return Color.BLACK;
            }
        } else if (gameState.numBlackPawns == 0) // if black is only side without pawns
        {
            debugPrintln("BLACK has no more pawns");
            return Color.WHITE;
        }

        // end game if piece(s) causing check remain
        if (isPlayerInCheck(currentColor(), gameState.board)) {
            debugPrintln("turn started while final rank was reached");
            return getPlayerColor(gameState.getOpponent());
        }

        // detects a repeated move (cycle)
            // this is if this player's previous and current moves match this player's 2 moves before that
            // this indicates that a strategy is moving a piece back and forth repeatedly
        if (battleGame != null) {
            ArrayList<Turn> turns = battleGame.turns;
            Color currentColor = getPlayerColor(gameState.currentPlayer);
            boolean detectedRepeatedTwoMoves = turns.size() >= 7 &&
                    turns.get(turns.size() - 1).getTurnData().equals(turns.get(turns.size() - 5).getTurnData()) &&
                    turns.get(turns.size() - 3).getTurnData().equals(turns.get(turns.size() - 7).getTurnData());

            // increment's the current cycle length if repeat moves detected, otherwise resets the cycle length count
            if (currentColor.equals(Color.WHITE))
                battleGame.setWhiteCycleLength(detectedRepeatedTwoMoves ? (battleGame.getWhiteCycleLength() + 1) : 0);
            else //if (currentColor.equals(Color.BLACK))
                battleGame.setBlackCycleLength(detectedRepeatedTwoMoves ? (battleGame.getBlackCycleLength() + 1) : 0);

            // end game if a strategy has repeated two moves enough times to reach the MOVE_CYCLE_CAP
            // the strategy that violated this MOVE_CYCLE_CAP loses the game
            final int MOVE_CYCLE_CAP = 5;
            if (battleGame.getWhiteCycleLength() >= MOVE_CYCLE_CAP) {
                appendStackTraceString("Malicious behavior detected from White");
                return getPlayerColor(gameState.BLACK);
            } else if (battleGame.getBlackCycleLength() >= MOVE_CYCLE_CAP) {
                appendStackTraceString("Malicious behavior detected from Black");
                return getPlayerColor(gameState.WHITE);
            }
        }

        // end game if reached turn cap
        final int TURN_CAP = 2000;
        if (gameState.numMovesMade >= TURN_CAP) {
            // determine ambiguous winner
            Color winnerColor;
            appendStackTraceString("Turn cap reached");

            // If no tie, give win to side w/ most pawns remaining
            winnerColor = runTieBreaker(gameState.numWhitePawns, gameState.numBlackPawns);
            if (!winnerColor.equals(Color.ERROR_PLAYER))
                return winnerColor;

            // If no tie, give win to side w/ most pieces remaining
            winnerColor = runTieBreaker(gameState.numWhitePieces, gameState.numBlackPieces);
            if (!winnerColor.equals(Color.ERROR_PLAYER))
                return winnerColor;


            // If no tie, give win to side w/ the furthest advanced pawn
            winnerColor = runTieBreaker(getFurthestAdvancedPawnDistance(Color.WHITE), getFurthestAdvancedPawnDistance(Color.BLACK));
            if (!winnerColor.equals(Color.ERROR_PLAYER))
                return winnerColor;

            // As a final tiebreaker, give win to black because white always takes the first turn of the game
            return Color.BLACK;
        }

        return null;
    }

    // Compares two values and returns the color with the greater value
    // Returns Color.ERROR_PLAYER if a tie occurs;
    public static Color runTieBreaker(int whiteVal, int blackVal) {
        if (whiteVal == blackVal) // on tie, return ERROR_PLAYER
            return Color.ERROR_PLAYER;
        else // return the color of the side with the greater value
            return (whiteVal > blackVal) ? Color.WHITE : Color.BLACK;
    }

    // get distance that furthest pawn has traveled (this is number of rows from that sides back rank)
    public static int getFurthestAdvancedPawnDistance(Color colorToCheck) {
        API api = new API();
        boolean isWhite = colorToCheck.equals(Color.WHITE);
        int backRankRow = isWhite ? BOARD_LENGTH - 1 : 0;

        for (int distAdvanced = BOARD_LENGTH - 1; distAdvanced >= 0; distAdvanced--) {
            int row = isWhite ? (backRankRow - distAdvanced) : (backRankRow + distAdvanced);

            for (int col = 0; col < BOARD_LENGTH; col++) {
                String curPiece = api.getCellValue(col, row, gameState.board);

                // if the current piece is a pawn of the color that we are checking
                if (api.getPieceMoveDistance(col, row, gameState.board) == 1 && getPlayerColor(api.getPieceColor(col, row, gameState.board)).equals(colorToCheck)) {;
                    return distAdvanced;
                }
            }
        }

        // this case should only be reached if this color has no pawns left
        return 0;
    }

    // changes whose turn it is in the gameState
    public static void alternatePlayer() {
        gameState.currentPlayer = gameState.getOpponent();
    }

    // sets the winner of the battleGame
    public static void processBattleGameWinner(Battle battle, BattleGame currentBattleGame, Color gameWinner) {
        boolean attackerIsWhite = battle.getAttackerColor().equals(Color.WHITE);
        int aPi = attackerIsWhite ? gameState.numWhitePieces : gameState.numBlackPieces;
        int dPi = !attackerIsWhite ? gameState.numWhitePieces : gameState.numBlackPieces;
        int aPa = attackerIsWhite ? gameState.numWhitePawns : gameState.numBlackPawns;
        int dPa = !attackerIsWhite ? gameState.numWhitePawns : gameState.numBlackPawns;

        // writes JSON obj
        ObjectMapper mapper = new ObjectMapper();
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        String jsonBoard = null;
        try {
            jsonBoard = mapper.writeValueAsString(addPieceIdsUnreliableIds(gameState.board));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            System.out.println("JSON writing of JSON board failed");
        }

        if (currentBattleGame.stackTrace.length() <= 0)
            currentBattleGame.stackTrace += compressedExecutionTraceHolder[1];
        appendStackTraceString("");
        currentBattleGame.setWinner(gameWinner, jsonBoard, aPi, aPa, dPi, dPa);
        battle.processGameWinner(currentBattleGame, gameWinner);
    }

    public static void printBoard() {
        printBoardGeneric(gameState.board);
    }

    static void printBoardGeneric(String[][] board) {
        System.out.printf("\n\nMove %d: A\tB\tC\tD\tE\tF\tG\tH\tI\tJ\n", gameState.numMovesMade);
        for (int i = 0; i < BOARD_LENGTH; i++) {
            System.out.printf("%d\t{", i);
            for (int j = 0; j < BOARD_LENGTH; j++)
                System.out.printf("\t%s,", board[j][i]);
            System.out.print("\t},\n");
        }
        System.out.printf("W:%d\twPawns:%d\tB:%d\tbPawns:%d\n", gameState.numWhitePieces, gameState.numWhitePawns,
                gameState.numBlackPieces, gameState.numBlackPawns);
        System.out.print("\n\n");
    }

    // Returns true if the passed moveString is in the format "<fromCell>,
    // <toCell>",
    // using valid cells. A player cannot land on their own pieces, and moves
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

        boolean movingPieceNotFarEnough = ((0 < Math.abs(cellToRow(fromCell) - cellToRow(toCell))
                && Math.abs(cellToRow(fromCell) - cellToRow(toCell)) < pieceMoveDistance)
                || (0 < Math.abs(cellToCol(fromCell) - cellToCol(toCell))
                        && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) < pieceMoveDistance));

        if (movingPieceNotFarEnough) {
            debugPrintln("Trying to move piece not far enough");
            return false;
        }

        boolean movingPieceTooFar = ((Math.abs(cellToRow(fromCell) - cellToRow(toCell)) > pieceMoveDistance)
                || (Math.abs(cellToCol(fromCell) - cellToCol(toCell)) > pieceMoveDistance));

        if (movingPieceTooFar)
            debugPrintln("Trying to move piece too far");

        return !movingPieceTooFar;
    }

    // returns true if the passed cell string is properly formatted
    // and refers to a valid cell on the game board
    static boolean isCellValid(String cell) {
        if (cell == null || cell.length() != 2)
            return false;

        char colChar = cell.charAt(0);
        char rowChar = cell.charAt(1);

        return !((colChar < 'A' || colChar > 'J') || (rowChar < '0' || rowChar > '9'));
    }

    static int getPieceMoveDistance(String cell, String[][] board) {
        return (new API()).getPieceMoveDistance(cell, board);

        /*
         * if (!isCellValid(cell))
         * return 0;
         * int col = cellToCol(cell);
         * int row = cellToRow(cell);
         * String cellVal = board[col][row];
         * if (cellVal.equals(""))
         * return 0;
         * return Integer.parseInt(cellVal.substring(1));
         */
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

    // returns the translation of the cell's first character to it's corresponding
    // index in board[]
    static int cellToCol(String cell) {
        return cell.charAt(0) - 'A';
    }

    // returns the translation of the cell's second character to it's corresponding
    // index in board[][]
    static int cellToRow(String cell) {
        return Integer.parseInt(cell.substring(1, 2));
    }

    // a string representing the passed player/color
    static String playerString(int player) {
        return Color.values()[player].name();
    }

    // updates the number of pieces still on the board in gameState
    static void processLosePiece(Color pieceColor, int pieceMoveDistance) {
        if (pieceColor.equals(Color.WHITE)) {
            gameState.numWhitePieces--;
            if (pieceMoveDistance == 1)
                gameState.numWhitePawns--;

            debugPrintln("\t\t\t\t\t\t\t\t\t\t\t\t\tLosing WHITE piece");
        } else if (pieceColor.equals(Color.BLACK)) {
            gameState.numBlackPieces--;
            if (pieceMoveDistance == 1)
                gameState.numBlackPawns--;

            debugPrintln("\t\t\t\t\t\t\t\t\t\t\t\t\tLosing BLACK piece");
        }
    }

    // sends the given message over a RabbitMQ Queue of the name, queueName
    static <T> void sendRabbitMQMessage(T res, String queueName) {
        ConnectionFactory factory = new ConnectionFactory();
        setupConnection(factory);

        try {
            Connection connection = factory.newConnection();
            System.out.println("Created RabbitMQ connection");
            Channel channel = connection.createChannel();

            System.out.println("Ensuring queue " + queueName + " exists...");
            // Creates queue if not already created an prepares to listen for messages
            channel.queueDeclare(queueName, true, false, false, null);

            // writes JSON obj
            ObjectMapper mapper = new ObjectMapper();
            mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            String messageJSON;
            try {
                // assumes queue name is the class name + 's'
                System.out.println("Queue exists. Trying to serialize response object to JSON...");
                String className = queueName.substring(0, queueName.length() - 1);
                MassTransitMessage<T> message = new MassTransitMessage(
                        UUID.randomUUID().toString(), null, null, UUID.randomUUID().toString(), null, null, null,
                        null, null, new String[] { "urn:message:AVA.API.Consumers:" + className }, res);
                messageJSON = mapper.writeValueAsString(message);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                System.out.println("JSON writing of message failed     response: " + res);
                return;
            }

            /*
             * String delimiter = SimulationApp.MESSAGE_DELIMITER;
             * String message = UUID.randomUUID() + delimiter + attackingStrategySource +
             * delimiter + UUID.randomUUID() + delimiter + defendingStrategySource +
             * delimiter + numGames;
             */
            System.out.println("JSON serialized. Trying to send message to queue...");
            channel.basicPublish("", queueName, null, messageJSON.getBytes());
            System.out.println("Message sent successfully.");

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("ERROR: message out to queue: " + queueName + " FAILED");
        }
    }

    // adds piece ids with unreliable ids (this means that the ids are there for the
    // frontend)
    // it does not add piece ids that match with what the id should actually be if
    // the game was played fully
    static String[][] addPieceIdsUnreliableIds(String[][] prevBoard) {
        String[][] newBoard = new String[prevBoard.length][prevBoard[0].length];

        int lastIdAdded = 0;

        for (int c = 0; c < newBoard.length; c++) {
            for (int r = 0; r < newBoard[c].length; r++) {
                if (prevBoard[c][r] == "") {
                    newBoard[c][r] = prevBoard[c][r];
                    continue;
                }

                String idString = lastIdAdded + "";
                if (idString.length() < 2)
                    idString = "0" + idString;

                newBoard[c][r] = idString + prevBoard[c][r];
                lastIdAdded++;
            }
        }

        return newBoard;
    }

    // deep copies a 2D array (board)
    static String[][] deepCopyBoard(String[][] board) {
        int numCols = gameState.board.length;
        int numRows = gameState.board[0].length;
        String[][] result = new String[numCols][numRows];

        for (int col = 0; col < numCols; col++) {
            for (int row = 0; row < numRows; row++)
                result[col][row] = board[col][row];
        }

        return result;
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
        while (System.currentTimeMillis() < gameEndTime + msToWait) {
        }
    }

    static String getRandomAIJS() {
        String s = "// cell values are NEVER null - they should be \"\" if empty\n" +
                "var NUM_PIECES_PER_SIDE = 20; // int\n" +
                "var NUM_PAWNS_PER_SIDE = 9; // int\n" +
                "var BOARD_LENGTH = 10; // int\n" +
                "var MIN_MOVE_DISTANCE = 1; // int\n" +
                "var MAX_MOVE_DISTANCE = 4; // int\n" +
                "var WHITE_CHAR = 'w'; // char\n" +
                "var BLACK_CHAR = 'b'; // char\n" +
                "var VALID_MOVES_ARRAY_LENGTH = 81; // int\n" +
                "var TRUE = 1; // int\n" +
                "var FALSE = 0; // int\n" +
                "var WHITE = 0; // int\n" +
                "var BLACK = 1; // int\n" +
                "var NO_PIECE = -1; // int\n" +
                "var ERR_INVALID_COLOR = -2; // int\n" +
                "var ERR_INVALID_COL = -3; // int\n" +
                "var ERR_INVALID_ROW = -4; // int\n" +
                "var ERR_FORMAT = -5; // int\n" +
                "var ERR_FORMAT_MOVE_FROM = -6; // int\n" +
                "var ERR_FORMAT_MOVE_TO = -7; // int\n" +
                "var GameState = /** @class */ (function () {\n" +
                "    function GameState() {\n" +
                "        this.currentPlayer = 0;\n" +
                "        this.numWhitePieces = 20;\n" +
                "        this.numBlackPieces = 20;\n" +
                "        this.numWhitePawns = 9;\n" +
                "        this.numBlackPawns = 9;\n" +
                "        this.numMovesMade = 0;\n" +
                "        var col9 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w3\");\n" +
                "        var col8 = new Array(\"b3\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w3\");\n" +
                "        var col7 = new Array(\"b2\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w2\");\n" +
                "        var col6 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        var col5 = new Array(\"b4\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w4\");\n" +
                "        var col4 = new Array(\"b4\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w4\");\n" +
                "        var col3 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        var col2 = new Array(\"b2\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w2\");\n" +
                "        var col1 = new Array(\"b3\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w3\");\n" +
                "        var col0 = new Array(\"b3\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        this.board = new Array(col9, col8, col7, col6, col5, col4, col3, col2, col1, col0);\n" +
                "    }\n" +
                "    return GameState;\n" +
                "}());\n" +
                "/**\n" +
                " * @return {string[][]} -           The String[][] representation of the game\n" +
                " board, comprised of ‘cells’, as described\n" +
                " at the top of this doc.\n" +
                " */\n" +
                "function getBoard() {\n" +
                "    return gameState.board;\n" +
                "}\n" +
                "/**\n" +
                " * @return {number}\t-\t  \t An integer representing the color of\n" +
                " * \t\t\t\t \t the current player.\n" +
                " * \t\t\t\t \t 0 = WHITE  and  1 = BLACK\n" +
                " */\n" +
                "function getMyColor() {\n" +
                "    return gameState.currentPlayer;\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {number} myColor - An integer representing the color of\n" +
                " * \t\t\t\t \t the not current player.\n" +
                " * @returns {number}\t-\t  \t An integer representing the color of\n" +
                " * \t\t\t\t \t the not current player.\n" +
                " * \t\t\t\t \t 0 = WHITE  and  1 = BLACK\n" +
                " * \t\t\t\t \t Returns a negative integer, ERR_INVALID_COLOR,\n" +
                " * \t\t\t\t \t if myColor is invalid\n" +
                " */\n" +
                "function getOpponentColor(myColor) {\n" +
                "    if (myColor === WHITE)\n" +
                "        return BLACK;\n" +
                "    else if (myColor === BLACK)\n" +
                "        return WHITE;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "}\n" +
                "function getCellValue(arg1, arg2) {\n" +
                "    // getCellValue(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var foundVal = getCellValue(cellToCol(cell), cellToRow(cell));\n" +
                "        if (foundVal === null || foundVal.length != 2)\n" +
                "            return \"\";\n" +
                "        return foundVal;\n" +
                "    }\n" +
                "    // getCellValue(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var board = gameState.board;\n" +
                "    return board[col][row];\n" +
                "}\n" +
                "/*\n" +
                "--------------------\n" +
                "    Array Indexing\n" +
                "--------------------\n" +
                "*/\n" +
                "/**\n" +
                " * @param {string}  cell -   The position of the cell on the board, from values “A0” to “J9”.\n" +
                " *\n" +
                " * @return {number} -       The index of the target cell’s column in the\n" +
                " *\t\t\t\t String[][] board.\n" +
                " *                Returns a negative integer if an error occurs.\n" +
                " *\n" +
                " * \t\t         Returns ERR_INVALID_COL if cell's column\n" +
                " *                is a character outside of the range A-J.\n" +
                " *                Returns ERR_INVALID_ROW if cell's row\n" +
                " *                is a character outside of the range 0-9.\n" +
                " *                Returns ERR_FORMAT if the cell is\n" +
                " *                otherwise improperly formatted.\n" +
                " */\n" +
                "function cellToCol(cell) {\n" +
                "    var isCellValidRet = isCellValid(cell, null);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return cellToColChar(cell) - 'A'.charCodeAt(0);\n" +
                "}\n" +
                "/**\n" +
                " * @param {string} cell -  The position of the cell on the board, from\n" +
                " * \t\t\t\t values “A0” to “J9”.\n" +
                " * @return {number} -       The index of the target cell’s row in the\n" +
                " *\t\t\t\t String[][] board.\n" +
                " *                Returns a negative integer if an error occurs.\n" +
                " *\n" +
                " * \t\t         Returns ERR_INVALID_COL if cell's column\n" +
                " *                is a character outside of the range A-J.\n" +
                " *                Returns ERR_INVALID_ROW if cell's row\n" +
                " *                is a character outside of the range 0-9.\n" +
                " *                Returns ERR_FORMAT if the cell is\n" +
                " *                otherwise improperly formatted.\n" +
                " */\n" +
                "function cellToRow(cell) {\n" +
                "    var isCellValidRet = isCellValid(cell, null);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return parseInt(cell.substring(1));\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {string} cell - The position of the cell on the board, from\n" +
                " * \t\t\t\t values \"A0\" to \"J9\".\n" +
                " *\n" +
                " * @return {number} -     The column of the cell on the board, from\n" +
                " * \t\t\t\t characters A-J as an ASCII integer.\n" +
                " *\n" +
                " *\t\t\t\t See Board documention\n" +
                " */\n" +
                "function cellToColChar(cell) {\n" +
                "    return cell.charCodeAt(0);\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {string} cell - The position of the cell on the board, from\n" +
                " * \t\t\t\t values \"A0\" to \"J9\".\n" +
                " * @return {number} -     The row of the cell on the board, from\n" +
                " * \t\t\t\t characters A-J as an ASCII number.\n" +
                " *\n" +
                " *\t\t\t\t See Board documention\n" +
                " */\n" +
                "function cellToRowChar(cell) {\n" +
                "    return cell.charCodeAt(1);\n" +
                "}\n" +
                "/*\n" +
                "----------------------\n" +
                "Array Index Conversion\n" +
                "----------------------\n" +
                "*/\n" +
                "/**\n" +
                " * @param {number} col -   The index of the target col’s row in the\n" +
                " * \t\t\t\t String[][] board.\n" +
                " *\n" +
                " * @return {string} -      The column of the cell on the board, from\n" +
                " *\t\t\t\t characters A-J. See diagram at top of doc as a string of length 1.\n" +
                " */\n" +
                "function colToColChar(col) {\n" +
                "    return String.fromCharCode(col + 'A'.charCodeAt(0));\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} row -   The index of the target row’s row in the\n" +
                " * \t\t\t\t String[][] board.\n" +
                " *\n" +
                " * @return {string} -      The row of the cell on the board, from\n" +
                " *\t\t\t\t characters 0-9. See diagram at top of doc as a string of length 1.\n" +
                " */\n" +
                "function rowToRowChar(row) {\n" +
                "    return (\"\" + row).charAt(0);\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} col -   The index of the target cell’s column in the\n" +
                " * \t\t\t\t String[][] board, retrieved through using\n" +
                " * \t\t\t\t cellToCol().\n" +
                " * @param {number} row -   The index of the target cell’s row in the\n" +
                " * \t\t\t\t String[][] board, retrieved through using\n" +
                " * \t\t\t\t cellToRow().\n" +
                " * @return {string}       The two-character position of the cell on the\n" +
                " * \t\t\t\t board, from values “A0” to “J9”, that\n" +
                " * \t\t\t\t corresponds to the passed row and column\n" +
                " * \t\t\t\t indices.\n" +
                " *\t\t\t \t For example, colAndRowToCell(2, 4) returns “C4”\n" +
                " */\n" +
                "function colAndRowToCell(col, row) {\n" +
                "    return \"\" + colToColChar(col) + rowToRowChar(row);\n" +
                "}\n" +
                "function cellHasPiece(arg1, arg2) {\n" +
                "    // cellHasPiece(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass to overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // cellHasPiece(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return !(getCellValue(col, row) === \"\") ? TRUE : FALSE;\n" +
                "}\n" +
                "function isMyPiece(arg1, arg2, arg3) {\n" +
                "    // isMyPiece(cell, myColor, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass to overload\n" +
                "        arg3 = arg2;\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // isMyPiece(col, row, myColor)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return getPieceColor(col, row) === myColor ? TRUE : FALSE;\n" +
                "}\n" +
                "function getPieceColor(arg1, arg2) {\n" +
                "    // getPieceColor(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // getPieceColor(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    if (cellHasPiece(col, row) === FALSE)\n" +
                "        return NO_PIECE;\n" +
                "    var cellVal = getCellValue(col, row);\n" +
                "    var colorChar = cellVal.charAt(0);\n" +
                "    var returnColor;\n" +
                "    if (colorChar === WHITE_CHAR)\n" +
                "        returnColor = WHITE;\n" +
                "    else if (colorChar === BLACK_CHAR)\n" +
                "        returnColor = BLACK;\n" +
                "    else\n" +
                "        returnColor = NO_PIECE;\n" +
                "    return returnColor;\n" +
                "}\n" +
                "function getPieceMoveDistance(arg1, arg2) {\n" +
                "    // getPieceMoveDistance(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // getPieceMoveDistance(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    if (cellHasPiece(col, row) === FALSE)\n" +
                "        return 0;\n" +
                "    var cellVal = getCellValue(col, row);\n" +
                "    return parseInt(cellVal.substring(1));\n" +
                "}\n" +
                "/*\n" +
                "--------------------\n" +
                "    Strategy Helpers\n" +
                "--------------------\n" +
                "*/\n" +
                "/**\n" +
                " *\n" +
                " * @param {number} color - An integer representing the color of\n" +
                " * \t\t\t\t the current player.\n" +
                " * @return\t{string[]}\t- An array of cells that pieces of the specified\n" +
                " * \t\t\t\t color are in.  The array is of fixed length 20,\n" +
                " * \t\t\t\t with empty array entries having the value \"\".\n" +
                " */\n" +
                "function getMyPieceLocations(color) {\n" +
                "    var locations = new Array(NUM_PIECES_PER_SIDE);\n" +
                "    for (var i = 0; i < NUM_PIECES_PER_SIDE; i++)\n" +
                "        locations[i] = \"\";\n" +
                "    var curArrIndex = 0;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        for (var j = 0; j < BOARD_LENGTH; j++) {\n" +
                "            if (isMyPiece(i, j, color) === TRUE) {\n" +
                "                locations[curArrIndex] = colAndRowToCell(i, j);\n" +
                "                curArrIndex++;\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "    return locations;\n" +
                "}\n" +
                "function getValidMoves(arg1, arg2, arg3) {\n" +
                "    // getValidMoves(cell, myColor, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg3 = arg2;\n" +
                "        arg2 = cellToRow(cell);\n" +
                "        arg1 = cellToCol(cell);\n" +
                "    }\n" +
                "    // getValidMoves(col, row, myColor);\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    var moves = new Array(VALID_MOVES_ARRAY_LENGTH);\n" +
                "    for (var i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {\n" +
                "        moves[i] = \"\";\n" +
                "    }\n" +
                "    var currentArrayIndex = 0;\n" +
                "    var moveDistance = getPieceMoveDistance(col, row);\n" +
                "    if (moveDistance <= 0)\n" +
                "        return moves;\n" +
                "    for (var i = -moveDistance; i <= moveDistance; i += moveDistance) { //William, you almost got it right. I just need to change two places in the code, i++ and j++\n"
                +
                "        for (var j = -moveDistance; j <= moveDistance; j += moveDistance) { //to i += moveDistance and j += moveDistance ! Plus corresponding code in SimulationApp\n"
                +
                "            var newCol = col + i;\n" +
                "            var newRow = row + j;\n" +
                "            if ((isCellValid(newCol, newRow) === TRUE)\n" +
                "                && isMyPiece(newCol, newRow, myColor) != TRUE) {\n" +
                "                var pieceColor = getPieceColor(col, row);\n" +
                "                /*if (isPlayerInCheck(pieceColor) === TRUE && ((pieceColor === WHITE && row != 0) || (pieceColor === BLACK && row != 9)))\n"
                +
                "                    continue;*/\n" +
                "                if (isPlayerInCheck(pieceColor) === TRUE) {\n" +
                "                    var columnInCheck = whichColumnIsPlayerInCheck(pieceColor);\n" +
                "                    var rowToCheck = (pieceColor === WHITE) ? 9 : 0;\n" +
                "                    if (newCol != columnInCheck || newRow != rowToCheck)\n" +
                "                        continue;\n" +
                "                }\n" +
                "                moves[currentArrayIndex] = colAndRowToCell(newCol, newRow);\n" +
                "                currentArrayIndex++;\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "    return moves;\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} color - An integer representing the color of\n" +
                " * \t\t\t     the current player.\n" +
                " * \t\t\t     0 = WHITE  and  1 = BLACK\n" +
                "\n" +
                " * @return {number} -      Returns TRUE if the given player’s opponent has\n" +
                " gotten a 1-piece of theirs to the given\n" +
                " player’s starting side of the board.  Only\n" +
                " moves that capture this 1-piece will be valid,\n" +
                " and failure to capture it will result in a\n" +
                " checkmate.\n" +
                " Returns FALSE if the given player’s opponent\n" +
                " does not meet the above condition.\n" +
                " Returns a negative integer if an\n" +
                " error occurs.\n" +
                "\n" +
                " * \t\t         Returns ERR_INVALID_COLOR if the passed color\n" +
                " is not WHITE or BLACK.\n" +
                " */\n" +
                "// similar func in GameState\n" +
                "function isPlayerInCheck(color) {\n" +
                "    var rowToCheck;\n" +
                "    if (color === WHITE)\n" +
                "        rowToCheck = 9;\n" +
                "    else if (color === BLACK)\n" +
                "        rowToCheck = 0;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))\n" +
                "            && (getPieceMoveDistance(i, rowToCheck) === 1))\n" +
                "            return TRUE;\n" +
                "    }\n" +
                "    return FALSE;\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} color  An integer representing the color of\n" +
                " * \t\t\t     the current player.\n" +
                " * \t\t\t     0 = WHITE  and  1 = BLACK\n" +
                "\n" +
                " * @return {number} -      Assumes the given player’s opponent has\n" +
                " gotten a 1-piece of theirs to the given\n" +
                " player’s starting side of the board, and returns the column that 1-piece is in.  Only\n" +
                " moves that capture this 1-piece will be valid,\n" +
                " and failure to capture it will result in a\n" +
                " checkmate.\n" +
                " Returns a negative integer if an\n" +
                " error occurs.\n" +
                "\n" +
                " Returns NO_PIECE if the given player’s opponent\n" +
                " does not meet the above condition.\n" +
                "\n" +
                " * \t\t         Returns ERR_INVALID_COLOR if the passed color\n" +
                " is not WHITE or BLACK.\n" +
                " */\n" +
                "function whichColumnIsPlayerInCheck(color) {\n" +
                "    var rowToCheck;\n" +
                "    if (color === WHITE)\n" +
                "        rowToCheck = 9;\n" +
                "    else if (color === BLACK)\n" +
                "        rowToCheck = 0;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))\n" +
                "            && (getPieceMoveDistance(i, rowToCheck) === 1))\n" +
                "            return i;\n" +
                "    }\n" +
                "    return NO_PIECE;\n" +
                "}\n" +
                "function isMoveValid(arg1, arg2, arg3) {\n" +
                "    // isMoveValid(moveString, myColor, unusedParam)\n" +
                "    if (typeof arg2 === 'number') {\n" +
                "        var moveString = arg1;\n" +
                "        var moveCells = moveString.split(\", \");\n" +
                "        if (moveCells.length != 2)\n" +
                "            return ERR_FORMAT;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg3 = arg2;\n" +
                "        arg1 = moveCells[0];\n" +
                "        arg2 = moveCells[1];\n" +
                "    }\n" +
                "    // isMoveValid(fromCell, toCell, myColor)\n" +
                "    var fromCell = arg1;\n" +
                "    var toCell = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    if (fromCell === null || toCell === null || fromCell.length != 2 || toCell.length != 2)\n" +
                "        return ERR_FORMAT;\n" +
                "    var cellValidRet = isCellValid(fromCell, null);\n" +
                "    if (cellValidRet != TRUE)\n" +
                "        return ERR_FORMAT_MOVE_FROM;\n" +
                "    cellValidRet = isCellValid(toCell, null);\n" +
                "    if (cellValidRet != TRUE)\n" +
                "        return ERR_FORMAT_MOVE_TO;\n" +
                "    var pieceMoveDistance = getPieceMoveDistance(fromCell, null);\n" +
                "    if (pieceMoveDistance === 0 || isMyPiece(fromCell, myColor, null) != TRUE || isMyPiece(toCell, myColor, null) === TRUE)\n"
                +
                "        return FALSE;\n" +
                "    if ((Math.abs(cellToRow(fromCell) - cellToRow(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance)\n"
                +
                "        || (Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance))\n"
                +
                "        return FALSE;\n" +
                "    return TRUE;\n" +
                "}\n" +
                "function isCellValid(arg1, arg2) {\n" +
                "    // isCellValid(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        if (cell === null || cell.length != 2)\n" +
                "            return ERR_FORMAT;\n" +
                "        var colChar = cell.charAt(0);\n" +
                "        var rowChar = cell.charAt(1);\n" +
                "        if (colChar < 'A' || colChar > 'J')\n" +
                "            return ERR_INVALID_COL;\n" +
                "        if (rowChar < '0' || rowChar > '9')\n" +
                "            return ERR_INVALID_ROW;\n" +
                "        return TRUE;\n" +
                "    }\n" +
                "    // isCellVAlid(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    if (col < 0 || col > 9)\n" +
                "        return ERR_INVALID_COL;\n" +
                "    if (row < 0 || row > 9)\n" +
                "        return ERR_INVALID_ROW;\n" +
                "    return TRUE;\n" +
                "}\n" +
                "function getMove() {\n" +
                "    console.log(\"starting getMove()\");\n" +
                "    var board = gameState.board;\n" +
                "    var pieceLocations = getMyPieceLocations(getMyColor());\n" +
                "    var numMovesFound = 0;\n" +
                "    var moves = new Array(NUM_PIECES_PER_SIDE);\n" +
                "    console.log(\"about to iterate for move\");\n" +
                "    for (var i = 0; i < NUM_PIECES_PER_SIDE; i++) {\n" +
                "        var piece = pieceLocations[i];\n" +
                "        if (piece === \"\")\n" +
                "            break;\n" +
                "        var validMoves = getValidMoves(piece, getMyColor(), null);\n" +
                "        for (var j = 0; j < VALID_MOVES_ARRAY_LENGTH; j++) {\n" +
                "            var move = validMoves[j];\n" +
                "            if (move === \"\")\n" +
                "                break;\n" +
                "            moves[numMovesFound] = piece + \", \" + move;\n" +
                "            console.log(piece);\n" +
                "            numMovesFound++;\n" +
                "        }\n" +
                "    }\n" +
                "\n" +
                "    if (numMovesFound === 0) { //if you have no legal moves, that means you are checkmated\n" +
                "        return \"CHECKMATED\";\n" +
                "    }\n" +
                //"    var ja = /*1;*/2;\n" +
                //"    ja = 3//;\n" +
                //"    ;\n" +
                //"    var /*jasd*/sss = \"/*jadska//jkl*///sadjk\";\n" +
                //"    //var sssa = \"\";\n"+
                //"    /*var ss//s = \"\";*/\n"+
                "    return moves[Math.floor((Math.random() * numMovesFound))];\n" +
                "}";

        return  s;/*"function whichColumnIsPlayerInCheck(color) {\n" +
                "    var rowToCheck;\n" +
                "    if (color === WHITE) rowToCheck = 9;\n" +
                "    else if (color === BLACK)\n" +
                "        rowToCheck = 0;\n" +
                "    else return ERR_INVALID_COLOR;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))\n" +
                "            && (getPieceMoveDistance(i, rowToCheck) === 1))\n" +
                "            return i;\n" +
                "    }\n" +
                "    return NO_PIECE;\n" +
                "}\n //this is random text\n" +
                "//some more random text\n" +
                "//some more random text\n" +
                "function getMove() {\n" +
                "    if (!(true))\n" +
                "       print(\"JS notIfPrint\");\n" +
                "    if (true)     // this is a comment {\n" +
                "       print(\"JS ifPrintComment\");\n" +
                "    if (true && true)\n" +
                "       print(\"JS ifPrint\");\n" +
                "    if (true && true && true) {\n" +
                "       print(\"JS enclosed ifPrint\");\n" +
                "    }\n" +
                "    print(\"JS print\");\n" +
                "    console.log(\"JS print\");\n" +
                "    if (true)\n" +
                "       return ajajb;\n\"A8, A7\";\n" +
                "    return \"A1, A2\";\n" +
                "}";*/
    }

    static String getMaliciousAI(int num) {
        String m1 = "// cell values are NEVER null - they should be \"\" if empty\n" +
                "var NUM_PIECES_PER_SIDE = 20; // int\n" +
                "var NUM_PAWNS_PER_SIDE = 9; // int\n" +
                "var BOARD_LENGTH = 10; // int\n" +
                "var MIN_MOVE_DISTANCE = 1; // int\n" +
                "var MAX_MOVE_DISTANCE = 4; // int\n" +
                "var WHITE_CHAR = 'w'; // char\n" +
                "var BLACK_CHAR = 'b'; // char\n" +
                "var VALID_MOVES_ARRAY_LENGTH = 81; // int\n" +
                "var TRUE = 1; // int\n" +
                "var FALSE = 0; // int\n" +
                "var WHITE = 0; // int\n" +
                "var BLACK = 1; // int\n" +
                "var NO_PIECE = -1; // int\n" +
                "var ERR_INVALID_COLOR = -2; // int\n" +
                "var ERR_INVALID_COL = -3; // int\n" +
                "var ERR_INVALID_ROW = -4; // int\n" +
                "var ERR_FORMAT = -5; // int\n" +
                "var ERR_FORMAT_MOVE_FROM = -6; // int\n" +
                "var ERR_FORMAT_MOVE_TO = -7; // int\n" +
                "var GameState = /** @class */ (function () {\n" +
                "    function GameState() {\n" +
                "        this.currentPlayer = 0;\n" +
                "        this.numWhitePieces = 20;\n" +
                "        this.numBlackPieces = 20;\n" +
                "        this.numWhitePawns = 9;\n" +
                "        this.numBlackPawns = 9;\n" +
                "        this.numMovesMade = 0;\n" +
                "        var col9 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w3\");\n" +
                "        var col8 = new Array(\"b3\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w3\");\n" +
                "        var col7 = new Array(\"b2\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w2\");\n" +
                "        var col6 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        var col5 = new Array(\"b4\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w4\");\n" +
                "        var col4 = new Array(\"b4\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w4\");\n" +
                "        var col3 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        var col2 = new Array(\"b2\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w2\");\n" +
                "        var col1 = new Array(\"b3\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w3\");\n" +
                "        var col0 = new Array(\"b3\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        this.board = new Array(col9, col8, col7, col6, col5, col4, col3, col2, col1, col0);\n" +
                "    }\n" +
                "    return GameState;\n" +
                "}());\n" +
                "/**\n" +
                " * @return {string[][]} -           The String[][] representation of the game\n" +
                " board, comprised of ‘cells’, as described\n" +
                " at the top of this doc.\n" +
                " */\n" +
                "function getBoard() {\n" +
                "    return gameState.board;\n" +
                "}\n" +
                "/**\n" +
                " * @return {number}\t-\t  \t An integer representing the color of\n" +
                " * \t\t\t\t \t the current player.\n" +
                " * \t\t\t\t \t 0 = WHITE  and  1 = BLACK\n" +
                " */\n" +
                "function getMyColor() {\n" +
                "    return gameState.currentPlayer;\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {number} myColor - An integer representing the color of\n" +
                " * \t\t\t\t \t the not current player.\n" +
                " * @returns {number}\t-\t  \t An integer representing the color of\n" +
                " * \t\t\t\t \t the not current player.\n" +
                " * \t\t\t\t \t 0 = WHITE  and  1 = BLACK\n" +
                " * \t\t\t\t \t Returns a negative integer, ERR_INVALID_COLOR,\n" +
                " * \t\t\t\t \t if myColor is invalid\n" +
                " */\n" +
                "function getOpponentColor(myColor) {\n" +
                "    if (myColor === WHITE)\n" +
                "        return BLACK;\n" +
                "    else if (myColor === BLACK)\n" +
                "        return WHITE;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "}\n" +
                "function getCellValue(arg1, arg2) {\n" +
                "    // getCellValue(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var foundVal = getCellValue(cellToCol(cell), cellToRow(cell));\n" +
                "        if (foundVal === null || foundVal.length != 2)\n" +
                "            return \"\";\n" +
                "        return foundVal;\n" +
                "    }\n" +
                "    // getCellValue(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var board = gameState.board;\n" +
                "    return board[col][row];\n" +
                "}\n" +
                "/*\n" +
                "--------------------\n" +
                "    Array Indexing\n" +
                "--------------------\n" +
                "*/\n" +
                "/**\n" +
                " * @param {string}  cell -   The position of the cell on the board, from values “A0” to “J9”.\n" +
                " *\n" +
                " * @return {number} -       The index of the target cell’s column in the\n" +
                " *\t\t\t\t String[][] board.\n" +
                " *                Returns a negative integer if an error occurs.\n" +
                " *\n" +
                " * \t\t         Returns ERR_INVALID_COL if cell's column\n" +
                " *                is a character outside of the range A-J.\n" +
                " *                Returns ERR_INVALID_ROW if cell's row\n" +
                " *                is a character outside of the range 0-9.\n" +
                " *                Returns ERR_FORMAT if the cell is\n" +
                " *                otherwise improperly formatted.\n" +
                " */\n" +
                "function cellToCol(cell) {\n" +
                "    var isCellValidRet = isCellValid(cell, null);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return cellToColChar(cell) - 'A'.charCodeAt(0);\n" +
                "}\n" +
                "/**\n" +
                " * @param {string} cell -  The position of the cell on the board, from\n" +
                " * \t\t\t\t values “A0” to “J9”.\n" +
                " * @return {number} -       The index of the target cell’s row in the\n" +
                " *\t\t\t\t String[][] board.\n" +
                " *                Returns a negative integer if an error occurs.\n" +
                " *\n" +
                " * \t\t         Returns ERR_INVALID_COL if cell's column\n" +
                " *                is a character outside of the range A-J.\n" +
                " *                Returns ERR_INVALID_ROW if cell's row\n" +
                " *                is a character outside of the range 0-9.\n" +
                " *                Returns ERR_FORMAT if the cell is\n" +
                " *                otherwise improperly formatted.\n" +
                " */\n" +
                "function cellToRow(cell) {\n" +
                "    var isCellValidRet = isCellValid(cell, null);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return parseInt(cell.substring(1));\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {string} cell - The position of the cell on the board, from\n" +
                " * \t\t\t\t values \"A0\" to \"J9\".\n" +
                " *\n" +
                " * @return {number} -     The column of the cell on the board, from\n" +
                " * \t\t\t\t characters A-J as an ASCII integer.\n" +
                " *\n" +
                " *\t\t\t\t See Board documention\n" +
                " */\n" +
                "function cellToColChar(cell) {\n" +
                "    return cell.charCodeAt(0);\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {string} cell - The position of the cell on the board, from\n" +
                " * \t\t\t\t values \"A0\" to \"J9\".\n" +
                " * @return {number} -     The row of the cell on the board, from\n" +
                " * \t\t\t\t characters A-J as an ASCII number.\n" +
                " *\n" +
                " *\t\t\t\t See Board documention\n" +
                " */\n" +
                "function cellToRowChar(cell) {\n" +
                "    return cell.charCodeAt(1);\n" +
                "}\n" +
                "/*\n" +
                "----------------------\n" +
                "Array Index Conversion\n" +
                "----------------------\n" +
                "*/\n" +
                "/**\n" +
                " * @param {number} col -   The index of the target col’s row in the\n" +
                " * \t\t\t\t String[][] board.\n" +
                " *\n" +
                " * @return {string} -      The column of the cell on the board, from\n" +
                " *\t\t\t\t characters A-J. See diagram at top of doc as a string of length 1.\n" +
                " */\n" +
                "function colToColChar(col) {\n" +
                "    return String.fromCharCode(col + 'A'.charCodeAt(0));\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} row -   The index of the target row’s row in the\n" +
                " * \t\t\t\t String[][] board.\n" +
                " *\n" +
                " * @return {string} -      The row of the cell on the board, from\n" +
                " *\t\t\t\t characters 0-9. See diagram at top of doc as a string of length 1.\n" +
                " */\n" +
                "function rowToRowChar(row) {\n" +
                "    return (\"\" + row).charAt(0);\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} col -   The index of the target cell’s column in the\n" +
                " * \t\t\t\t String[][] board, retrieved through using\n" +
                " * \t\t\t\t cellToCol().\n" +
                " * @param {number} row -   The index of the target cell’s row in the\n" +
                " * \t\t\t\t String[][] board, retrieved through using\n" +
                " * \t\t\t\t cellToRow().\n" +
                " * @return {string}       The two-character position of the cell on the\n" +
                " * \t\t\t\t board, from values “A0” to “J9”, that\n" +
                " * \t\t\t\t corresponds to the passed row and column\n" +
                " * \t\t\t\t indices.\n" +
                " *\t\t\t \t For example, colAndRowToCell(2, 4) returns “C4”\n" +
                " */\n" +
                "function colAndRowToCell(col, row) {\n" +
                "    return \"\" + colToColChar(col) + rowToRowChar(row);\n" +
                "}\n" +
                "function cellHasPiece(arg1, arg2) {\n" +
                "    // cellHasPiece(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass to overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // cellHasPiece(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return !(getCellValue(col, row) === \"\") ? TRUE : FALSE;\n" +
                "}\n" +
                "function isMyPiece(arg1, arg2, arg3) {\n" +
                "    // isMyPiece(cell, myColor, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass to overload\n" +
                "        arg3 = arg2;\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // isMyPiece(col, row, myColor)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return getPieceColor(col, row) === myColor ? TRUE : FALSE;\n" +
                "}\n" +
                "function getPieceColor(arg1, arg2) {\n" +
                "    // getPieceColor(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // getPieceColor(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    if (cellHasPiece(col, row) === FALSE)\n" +
                "        return NO_PIECE;\n" +
                "    var cellVal = getCellValue(col, row);\n" +
                "    var colorChar = cellVal.charAt(0);\n" +
                "    var returnColor;\n" +
                "    if (colorChar === WHITE_CHAR)\n" +
                "        returnColor = WHITE;\n" +
                "    else if (colorChar === BLACK_CHAR)\n" +
                "        returnColor = BLACK;\n" +
                "    else\n" +
                "        returnColor = NO_PIECE;\n" +
                "    return returnColor;\n" +
                "}\n" +
                "function getPieceMoveDistance(arg1, arg2) {\n" +
                "    // getPieceMoveDistance(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // getPieceMoveDistance(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    if (cellHasPiece(col, row) === FALSE)\n" +
                "        return 0;\n" +
                "    var cellVal = getCellValue(col, row);\n" +
                "    return parseInt(cellVal.substring(1));\n" +
                "}\n" +
                "/*\n" +
                "--------------------\n" +
                "    Strategy Helpers\n" +
                "--------------------\n" +
                "*/\n" +
                "/**\n" +
                " *\n" +
                " * @param {number} color - An integer representing the color of\n" +
                " * \t\t\t\t the current player.\n" +
                " * @return\t{string[]}\t- An array of cells that pieces of the specified\n" +
                " * \t\t\t\t color are in.  The array is of fixed length 20,\n" +
                " * \t\t\t\t with empty array entries having the value \"\".\n" +
                " */\n" +
                "function getMyPieceLocations(color) {\n" +
                "    var locations = new Array(NUM_PIECES_PER_SIDE);\n" +
                "    for (var i = 0; i < NUM_PIECES_PER_SIDE; i++)\n" +
                "        locations[i] = \"\";\n" +
                "    var curArrIndex = 0;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        for (var j = 0; j < BOARD_LENGTH; j++) {\n" +
                "            if (isMyPiece(i, j, color) === TRUE) {\n" +
                "                locations[curArrIndex] = colAndRowToCell(i, j);\n" +
                "                curArrIndex++;\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "    return locations;\n" +
                "}\n" +
                "function getValidMoves(arg1, arg2, arg3) {\n" +
                "    // getValidMoves(cell, myColor, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg3 = arg2;\n" +
                "        arg2 = cellToRow(cell);\n" +
                "        arg1 = cellToCol(cell);\n" +
                "    }\n" +
                "    // getValidMoves(col, row, myColor);\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    var moves = new Array(VALID_MOVES_ARRAY_LENGTH);\n" +
                "    for (var i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {\n" +
                "        moves[i] = \"\";\n" +
                "    }\n" +
                "    var currentArrayIndex = 0;\n" +
                "    var moveDistance = getPieceMoveDistance(col, row);\n" +
                "    if (moveDistance <= 0)\n" +
                "        return moves;\n" +
                "    for (var i = -moveDistance; i <= moveDistance; i += moveDistance) { //William, you almost got it right. I just need to change two places in the code, i++ and j++\n" +
                "        for (var j = -moveDistance; j <= moveDistance; j += moveDistance) { //to i += moveDistance and j += moveDistance ! Plus corresponding code in SimulationApp\n" +
                "            var newCol = col + i;\n" +
                "            var newRow = row + j;\n" +
                "            if ((isCellValid(newCol, newRow) === TRUE)\n" +
                "                && isMyPiece(newCol, newRow, myColor) != TRUE) {\n" +
                "                var pieceColor = getPieceColor(col, row);\n" +
                "                /*if (isPlayerInCheck(pieceColor) === TRUE && ((pieceColor === WHITE && row != 0) || (pieceColor === BLACK && row != 9)))\n" +
                "                    continue;*/\n" +
                "                if (isPlayerInCheck(pieceColor) === TRUE) {\n" +
                "                    var columnInCheck = whichColumnIsPlayerInCheck(pieceColor);\n" +
                "                    var rowToCheck = (pieceColor === WHITE) ? 9 : 0;\n" +
                "                    if (newCol != columnInCheck || newRow != rowToCheck)\n" +
                "                        continue;\n" +
                "                }\n" +
                "                moves[currentArrayIndex] = colAndRowToCell(newCol, newRow);\n" +
                "                currentArrayIndex++;\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "    return moves;\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} color - An integer representing the color of\n" +
                " * \t\t\t     the current player.\n" +
                " * \t\t\t     0 = WHITE  and  1 = BLACK\n" +
                "\n" +
                " * @return {number} -      Returns TRUE if the given player’s opponent has\n" +
                " gotten a 1-piece of theirs to the given\n" +
                " player’s starting side of the board.  Only\n" +
                " moves that capture this 1-piece will be valid,\n" +
                " and failure to capture it will result in a\n" +
                " checkmate.\n" +
                " Returns FALSE if the given player’s opponent\n" +
                " does not meet the above condition.\n" +
                " Returns a negative integer if an\n" +
                " error occurs.\n" +
                "\n" +
                " * \t\t         Returns ERR_INVALID_COLOR if the passed color\n" +
                " is not WHITE or BLACK.\n" +
                " */\n" +
                "// similar func in GameState\n" +
                "function isPlayerInCheck(color) {\n" +
                "    var rowToCheck;\n" +
                "    if (color === WHITE)\n" +
                "        rowToCheck = 9;\n" +
                "    else if (color === BLACK)\n" +
                "        rowToCheck = 0;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))\n" +
                "            && (getPieceMoveDistance(i, rowToCheck) === 1))\n" +
                "            return TRUE;\n" +
                "    }\n" +
                "    return FALSE;\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} color  An integer representing the color of\n" +
                " * \t\t\t     the current player.\n" +
                " * \t\t\t     0 = WHITE  and  1 = BLACK\n" +
                "\n" +
                " * @return {number} -      Assumes the given player’s opponent has\n" +
                " gotten a 1-piece of theirs to the given\n" +
                " player’s starting side of the board, and returns the column that 1-piece is in.  Only\n" +
                " moves that capture this 1-piece will be valid,\n" +
                " and failure to capture it will result in a\n" +
                " checkmate.\n" +
                " Returns a negative integer if an\n" +
                " error occurs.\n" +
                "\n" +
                " Returns NO_PIECE if the given player’s opponent\n" +
                " does not meet the above condition.\n" +
                "\n" +
                " * \t\t         Returns ERR_INVALID_COLOR if the passed color\n" +
                " is not WHITE or BLACK.\n" +
                " */\n" +
                "function whichColumnIsPlayerInCheck(color) {\n" +
                "    var rowToCheck;\n" +
                "    if (color === WHITE)\n" +
                "        rowToCheck = 9;\n" +
                "    else if (color === BLACK)\n" +
                "        rowToCheck = 0;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))\n" +
                "            && (getPieceMoveDistance(i, rowToCheck) === 1))\n" +
                "            return i;\n" +
                "    }\n" +
                "    return NO_PIECE;\n" +
                "}\n" +
                "function isMoveValid(arg1, arg2, arg3) {\n" +
                "    // isMoveValid(moveString, myColor, unusedParam)\n" +
                "    if (typeof arg2 === 'number') {\n" +
                "        var moveString = arg1;\n" +
                "        var moveCells = moveString.split(\", \");\n" +
                "        if (moveCells.length != 2)\n" +
                "            return ERR_FORMAT;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg3 = arg2;\n" +
                "        arg1 = moveCells[0];\n" +
                "        arg2 = moveCells[1];\n" +
                "    }\n" +
                "    // isMoveValid(fromCell, toCell, myColor)\n" +
                "    var fromCell = arg1;\n" +
                "    var toCell = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    if (fromCell === null || toCell === null || fromCell.length != 2 || toCell.length != 2)\n" +
                "        return ERR_FORMAT;\n" +
                "    var cellValidRet = isCellValid(fromCell, null);\n" +
                "    if (cellValidRet != TRUE)\n" +
                "        return ERR_FORMAT_MOVE_FROM;\n" +
                "    cellValidRet = isCellValid(toCell, null);\n" +
                "    if (cellValidRet != TRUE)\n" +
                "        return ERR_FORMAT_MOVE_TO;\n" +
                "    var pieceMoveDistance = getPieceMoveDistance(fromCell, null);\n" +
                "    if (pieceMoveDistance === 0 || isMyPiece(fromCell, myColor, null) != TRUE || isMyPiece(toCell, myColor, null) === TRUE)\n" +
                "        return FALSE;\n" +
                "    if ((Math.abs(cellToRow(fromCell) - cellToRow(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance)\n" +
                "        || (Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance))\n" +
                "        return FALSE;\n" +
                "    return TRUE;\n" +
                "}\n" +
                "function isCellValid(arg1, arg2) {\n" +
                "    // isCellValid(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        if (cell === null || cell.length != 2)\n" +
                "            return ERR_FORMAT;\n" +
                "        var colChar = cell.charAt(0);\n" +
                "        var rowChar = cell.charAt(1);\n" +
                "        if (colChar < 'A' || colChar > 'J')\n" +
                "            return ERR_INVALID_COL;\n" +
                "        if (rowChar < '0' || rowChar > '9')\n" +
                "            return ERR_INVALID_ROW;\n" +
                "        return TRUE;\n" +
                "    }\n" +
                "    // isCellVAlid(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    if (col < 0 || col > 9)\n" +
                "        return ERR_INVALID_COL;\n" +
                "    if (row < 0 || row > 9)\n" +
                "        return ERR_INVALID_ROW;\n" +
                "    return TRUE;\n" +
                "}\n" +
                "\n" +
                "//MaliciousAI1 tries to move the left 4 back and forth\n" +
                "function getMove() {\n" +
                "    var board = getBoard();\n" +
                "    var pieceLocations = getMyPieceLocations(getMyColor());\n" +
                "\n" +
                "    if (getMyColor() === 0) {    //we are playing white\n" +
                "        if (board[4][9] === (\"w4\")) {\n" +
                "            return \"E9, E5\";\n" +
                "        } else {\n" +
                "            return \"E5, E9\";\n" +
                "        }\n" +
                "    } else {                            //we are playing black\n" +
                "        if (board[4][0] === (\"b4\")) {\n" +
                "            return \"E0, E4\";\n" +
                "        } else {\n" +
                "            return \"E4, E0\";\n" +
                "        }\n" +
                "    }\n" +
                "}";

        String m2 = "// cell values are NEVER null - they should be \"\" if empty\n" +
                "var NUM_PIECES_PER_SIDE = 20; // int\n" +
                "var NUM_PAWNS_PER_SIDE = 9; // int\n" +
                "var BOARD_LENGTH = 10; // int\n" +
                "var MIN_MOVE_DISTANCE = 1; // int\n" +
                "var MAX_MOVE_DISTANCE = 4; // int\n" +
                "var WHITE_CHAR = 'w'; // char\n" +
                "var BLACK_CHAR = 'b'; // char\n" +
                "var VALID_MOVES_ARRAY_LENGTH = 81; // int\n" +
                "var TRUE = 1; // int\n" +
                "var FALSE = 0; // int\n" +
                "var WHITE = 0; // int\n" +
                "var BLACK = 1; // int\n" +
                "var NO_PIECE = -1; // int\n" +
                "var ERR_INVALID_COLOR = -2; // int\n" +
                "var ERR_INVALID_COL = -3; // int\n" +
                "var ERR_INVALID_ROW = -4; // int\n" +
                "var ERR_FORMAT = -5; // int\n" +
                "var ERR_FORMAT_MOVE_FROM = -6; // int\n" +
                "var ERR_FORMAT_MOVE_TO = -7; // int\n" +
                "var GameState = /** @class */ (function () {\n" +
                "    function GameState() {\n" +
                "        this.currentPlayer = 0;\n" +
                "        this.numWhitePieces = 20;\n" +
                "        this.numBlackPieces = 20;\n" +
                "        this.numWhitePawns = 9;\n" +
                "        this.numBlackPawns = 9;\n" +
                "        this.numMovesMade = 0;\n" +
                "        var col9 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w3\");\n" +
                "        var col8 = new Array(\"b3\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w3\");\n" +
                "        var col7 = new Array(\"b2\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w2\");\n" +
                "        var col6 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        var col5 = new Array(\"b4\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w4\");\n" +
                "        var col4 = new Array(\"b4\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w4\");\n" +
                "        var col3 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        var col2 = new Array(\"b2\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w2\");\n" +
                "        var col1 = new Array(\"b3\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w3\");\n" +
                "        var col0 = new Array(\"b3\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        this.board = new Array(col9, col8, col7, col6, col5, col4, col3, col2, col1, col0);\n" +
                "    }\n" +
                "    return GameState;\n" +
                "}());\n" +
                "/**\n" +
                " * @return {string[][]} -           The String[][] representation of the game\n" +
                " board, comprised of ‘cells’, as described\n" +
                " at the top of this doc.\n" +
                " */\n" +
                "function getBoard() {\n" +
                "    return gameState.board;\n" +
                "}\n" +
                "/**\n" +
                " * @return {number}\t-\t  \t An integer representing the color of\n" +
                " * \t\t\t\t \t the current player.\n" +
                " * \t\t\t\t \t 0 = WHITE  and  1 = BLACK\n" +
                " */\n" +
                "function getMyColor() {\n" +
                "    return gameState.currentPlayer;\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {number} myColor - An integer representing the color of\n" +
                " * \t\t\t\t \t the not current player.\n" +
                " * @returns {number}\t-\t  \t An integer representing the color of\n" +
                " * \t\t\t\t \t the not current player.\n" +
                " * \t\t\t\t \t 0 = WHITE  and  1 = BLACK\n" +
                " * \t\t\t\t \t Returns a negative integer, ERR_INVALID_COLOR,\n" +
                " * \t\t\t\t \t if myColor is invalid\n" +
                " */\n" +
                "function getOpponentColor(myColor) {\n" +
                "    if (myColor === WHITE)\n" +
                "        return BLACK;\n" +
                "    else if (myColor === BLACK)\n" +
                "        return WHITE;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "}\n" +
                "function getCellValue(arg1, arg2) {\n" +
                "    // getCellValue(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var foundVal = getCellValue(cellToCol(cell), cellToRow(cell));\n" +
                "        if (foundVal === null || foundVal.length != 2)\n" +
                "            return \"\";\n" +
                "        return foundVal;\n" +
                "    }\n" +
                "    // getCellValue(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var board = gameState.board;\n" +
                "    return board[col][row];\n" +
                "}\n" +
                "/*\n" +
                "--------------------\n" +
                "    Array Indexing\n" +
                "--------------------\n" +
                "*/\n" +
                "/**\n" +
                " * @param {string}  cell -   The position of the cell on the board, from values “A0” to “J9”.\n" +
                " *\n" +
                " * @return {number} -       The index of the target cell’s column in the\n" +
                " *\t\t\t\t String[][] board.\n" +
                " *                Returns a negative integer if an error occurs.\n" +
                " *\n" +
                " * \t\t         Returns ERR_INVALID_COL if cell's column\n" +
                " *                is a character outside of the range A-J.\n" +
                " *                Returns ERR_INVALID_ROW if cell's row\n" +
                " *                is a character outside of the range 0-9.\n" +
                " *                Returns ERR_FORMAT if the cell is\n" +
                " *                otherwise improperly formatted.\n" +
                " */\n" +
                "function cellToCol(cell) {\n" +
                "    var isCellValidRet = isCellValid(cell, null);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return cellToColChar(cell) - 'A'.charCodeAt(0);\n" +
                "}\n" +
                "/**\n" +
                " * @param {string} cell -  The position of the cell on the board, from\n" +
                " * \t\t\t\t values “A0” to “J9”.\n" +
                " * @return {number} -       The index of the target cell’s row in the\n" +
                " *\t\t\t\t String[][] board.\n" +
                " *                Returns a negative integer if an error occurs.\n" +
                " *\n" +
                " * \t\t         Returns ERR_INVALID_COL if cell's column\n" +
                " *                is a character outside of the range A-J.\n" +
                " *                Returns ERR_INVALID_ROW if cell's row\n" +
                " *                is a character outside of the range 0-9.\n" +
                " *                Returns ERR_FORMAT if the cell is\n" +
                " *                otherwise improperly formatted.\n" +
                " */\n" +
                "function cellToRow(cell) {\n" +
                "    var isCellValidRet = isCellValid(cell, null);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return parseInt(cell.substring(1));\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {string} cell - The position of the cell on the board, from\n" +
                " * \t\t\t\t values \"A0\" to \"J9\".\n" +
                " *\n" +
                " * @return {number} -     The column of the cell on the board, from\n" +
                " * \t\t\t\t characters A-J as an ASCII integer.\n" +
                " *\n" +
                " *\t\t\t\t See Board documention\n" +
                " */\n" +
                "function cellToColChar(cell) {\n" +
                "    return cell.charCodeAt(0);\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {string} cell - The position of the cell on the board, from\n" +
                " * \t\t\t\t values \"A0\" to \"J9\".\n" +
                " * @return {number} -     The row of the cell on the board, from\n" +
                " * \t\t\t\t characters A-J as an ASCII number.\n" +
                " *\n" +
                " *\t\t\t\t See Board documention\n" +
                " */\n" +
                "function cellToRowChar(cell) {\n" +
                "    return cell.charCodeAt(1);\n" +
                "}\n" +
                "/*\n" +
                "----------------------\n" +
                "Array Index Conversion\n" +
                "----------------------\n" +
                "*/\n" +
                "/**\n" +
                " * @param {number} col -   The index of the target col’s row in the\n" +
                " * \t\t\t\t String[][] board.\n" +
                " *\n" +
                " * @return {string} -      The column of the cell on the board, from\n" +
                " *\t\t\t\t characters A-J. See diagram at top of doc as a string of length 1.\n" +
                " */\n" +
                "function colToColChar(col) {\n" +
                "    return String.fromCharCode(col + 'A'.charCodeAt(0));\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} row -   The index of the target row’s row in the\n" +
                " * \t\t\t\t String[][] board.\n" +
                " *\n" +
                " * @return {string} -      The row of the cell on the board, from\n" +
                " *\t\t\t\t characters 0-9. See diagram at top of doc as a string of length 1.\n" +
                " */\n" +
                "function rowToRowChar(row) {\n" +
                "    return (\"\" + row).charAt(0);\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} col -   The index of the target cell’s column in the\n" +
                " * \t\t\t\t String[][] board, retrieved through using\n" +
                " * \t\t\t\t cellToCol().\n" +
                " * @param {number} row -   The index of the target cell’s row in the\n" +
                " * \t\t\t\t String[][] board, retrieved through using\n" +
                " * \t\t\t\t cellToRow().\n" +
                " * @return {string}       The two-character position of the cell on the\n" +
                " * \t\t\t\t board, from values “A0” to “J9”, that\n" +
                " * \t\t\t\t corresponds to the passed row and column\n" +
                " * \t\t\t\t indices.\n" +
                " *\t\t\t \t For example, colAndRowToCell(2, 4) returns “C4”\n" +
                " */\n" +
                "function colAndRowToCell(col, row) {\n" +
                "    return \"\" + colToColChar(col) + rowToRowChar(row);\n" +
                "}\n" +
                "function cellHasPiece(arg1, arg2) {\n" +
                "    // cellHasPiece(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass to overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // cellHasPiece(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return !(getCellValue(col, row) === \"\") ? TRUE : FALSE;\n" +
                "}\n" +
                "function isMyPiece(arg1, arg2, arg3) {\n" +
                "    // isMyPiece(cell, myColor, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass to overload\n" +
                "        arg3 = arg2;\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // isMyPiece(col, row, myColor)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return getPieceColor(col, row) === myColor ? TRUE : FALSE;\n" +
                "}\n" +
                "function getPieceColor(arg1, arg2) {\n" +
                "    // getPieceColor(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // getPieceColor(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    if (cellHasPiece(col, row) === FALSE)\n" +
                "        return NO_PIECE;\n" +
                "    var cellVal = getCellValue(col, row);\n" +
                "    var colorChar = cellVal.charAt(0);\n" +
                "    var returnColor;\n" +
                "    if (colorChar === WHITE_CHAR)\n" +
                "        returnColor = WHITE;\n" +
                "    else if (colorChar === BLACK_CHAR)\n" +
                "        returnColor = BLACK;\n" +
                "    else\n" +
                "        returnColor = NO_PIECE;\n" +
                "    return returnColor;\n" +
                "}\n" +
                "function getPieceMoveDistance(arg1, arg2) {\n" +
                "    // getPieceMoveDistance(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // getPieceMoveDistance(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    if (cellHasPiece(col, row) === FALSE)\n" +
                "        return 0;\n" +
                "    var cellVal = getCellValue(col, row);\n" +
                "    return parseInt(cellVal.substring(1));\n" +
                "}\n" +
                "/*\n" +
                "--------------------\n" +
                "    Strategy Helpers\n" +
                "--------------------\n" +
                "*/\n" +
                "/**\n" +
                " *\n" +
                " * @param {number} color - An integer representing the color of\n" +
                " * \t\t\t\t the current player.\n" +
                " * @return\t{string[]}\t- An array of cells that pieces of the specified\n" +
                " * \t\t\t\t color are in.  The array is of fixed length 20,\n" +
                " * \t\t\t\t with empty array entries having the value \"\".\n" +
                " */\n" +
                "function getMyPieceLocations(color) {\n" +
                "    var locations = new Array(NUM_PIECES_PER_SIDE);\n" +
                "    for (var i = 0; i < NUM_PIECES_PER_SIDE; i++)\n" +
                "        locations[i] = \"\";\n" +
                "    var curArrIndex = 0;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        for (var j = 0; j < BOARD_LENGTH; j++) {\n" +
                "            if (isMyPiece(i, j, color) === TRUE) {\n" +
                "                locations[curArrIndex] = colAndRowToCell(i, j);\n" +
                "                curArrIndex++;\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "    return locations;\n" +
                "}\n" +
                "function getValidMoves(arg1, arg2, arg3) {\n" +
                "    // getValidMoves(cell, myColor, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg3 = arg2;\n" +
                "        arg2 = cellToRow(cell);\n" +
                "        arg1 = cellToCol(cell);\n" +
                "    }\n" +
                "    // getValidMoves(col, row, myColor);\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    var moves = new Array(VALID_MOVES_ARRAY_LENGTH);\n" +
                "    for (var i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {\n" +
                "        moves[i] = \"\";\n" +
                "    }\n" +
                "    var currentArrayIndex = 0;\n" +
                "    var moveDistance = getPieceMoveDistance(col, row);\n" +
                "    if (moveDistance <= 0)\n" +
                "        return moves;\n" +
                "    for (var i = -moveDistance; i <= moveDistance; i += moveDistance) { //William, you almost got it right. I just need to change two places in the code, i++ and j++\n" +
                "        for (var j = -moveDistance; j <= moveDistance; j += moveDistance) { //to i += moveDistance and j += moveDistance ! Plus corresponding code in SimulationApp\n" +
                "            var newCol = col + i;\n" +
                "            var newRow = row + j;\n" +
                "            if ((isCellValid(newCol, newRow) === TRUE)\n" +
                "                && isMyPiece(newCol, newRow, myColor) != TRUE) {\n" +
                "                var pieceColor = getPieceColor(col, row);\n" +
                "                /*if (isPlayerInCheck(pieceColor) === TRUE && ((pieceColor === WHITE && row != 0) || (pieceColor === BLACK && row != 9)))\n" +
                "                    continue;*/\n" +
                "                if (isPlayerInCheck(pieceColor) === TRUE) {\n" +
                "                    var columnInCheck = whichColumnIsPlayerInCheck(pieceColor);\n" +
                "                    var rowToCheck = (pieceColor === WHITE) ? 9 : 0;\n" +
                "                    if (newCol != columnInCheck || newRow != rowToCheck)\n" +
                "                        continue;\n" +
                "                }\n" +
                "                moves[currentArrayIndex] = colAndRowToCell(newCol, newRow);\n" +
                "                currentArrayIndex++;\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "    return moves;\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} color - An integer representing the color of\n" +
                " * \t\t\t     the current player.\n" +
                " * \t\t\t     0 = WHITE  and  1 = BLACK\n" +
                "\n" +
                " * @return {number} -      Returns TRUE if the given player’s opponent has\n" +
                " gotten a 1-piece of theirs to the given\n" +
                " player’s starting side of the board.  Only\n" +
                " moves that capture this 1-piece will be valid,\n" +
                " and failure to capture it will result in a\n" +
                " checkmate.\n" +
                " Returns FALSE if the given player’s opponent\n" +
                " does not meet the above condition.\n" +
                " Returns a negative integer if an\n" +
                " error occurs.\n" +
                "\n" +
                " * \t\t         Returns ERR_INVALID_COLOR if the passed color\n" +
                " is not WHITE or BLACK.\n" +
                " */\n" +
                "// similar func in GameState\n" +
                "function isPlayerInCheck(color) {\n" +
                "    var rowToCheck;\n" +
                "    if (color === WHITE)\n" +
                "        rowToCheck = 9;\n" +
                "    else if (color === BLACK)\n" +
                "        rowToCheck = 0;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))\n" +
                "            && (getPieceMoveDistance(i, rowToCheck) === 1))\n" +
                "            return TRUE;\n" +
                "    }\n" +
                "    return FALSE;\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} color  An integer representing the color of\n" +
                " * \t\t\t     the current player.\n" +
                " * \t\t\t     0 = WHITE  and  1 = BLACK\n" +
                "\n" +
                " * @return {number} -      Assumes the given player’s opponent has\n" +
                " gotten a 1-piece of theirs to the given\n" +
                " player’s starting side of the board, and returns the column that 1-piece is in.  Only\n" +
                " moves that capture this 1-piece will be valid,\n" +
                " and failure to capture it will result in a\n" +
                " checkmate.\n" +
                " Returns a negative integer if an\n" +
                " error occurs.\n" +
                "\n" +
                " Returns NO_PIECE if the given player’s opponent\n" +
                " does not meet the above condition.\n" +
                "\n" +
                " * \t\t         Returns ERR_INVALID_COLOR if the passed color\n" +
                " is not WHITE or BLACK.\n" +
                " */\n" +
                "function whichColumnIsPlayerInCheck(color) {\n" +
                "    var rowToCheck;\n" +
                "    if (color === WHITE)\n" +
                "        rowToCheck = 9;\n" +
                "    else if (color === BLACK)\n" +
                "        rowToCheck = 0;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))\n" +
                "            && (getPieceMoveDistance(i, rowToCheck) === 1))\n" +
                "            return i;\n" +
                "    }\n" +
                "    return NO_PIECE;\n" +
                "}\n" +
                "function isMoveValid(arg1, arg2, arg3) {\n" +
                "    // isMoveValid(moveString, myColor, unusedParam)\n" +
                "    if (typeof arg2 === 'number') {\n" +
                "        var moveString = arg1;\n" +
                "        var moveCells = moveString.split(\", \");\n" +
                "        if (moveCells.length != 2)\n" +
                "            return ERR_FORMAT;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg3 = arg2;\n" +
                "        arg1 = moveCells[0];\n" +
                "        arg2 = moveCells[1];\n" +
                "    }\n" +
                "    // isMoveValid(fromCell, toCell, myColor)\n" +
                "    var fromCell = arg1;\n" +
                "    var toCell = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    if (fromCell === null || toCell === null || fromCell.length != 2 || toCell.length != 2)\n" +
                "        return ERR_FORMAT;\n" +
                "    var cellValidRet = isCellValid(fromCell, null);\n" +
                "    if (cellValidRet != TRUE)\n" +
                "        return ERR_FORMAT_MOVE_FROM;\n" +
                "    cellValidRet = isCellValid(toCell, null);\n" +
                "    if (cellValidRet != TRUE)\n" +
                "        return ERR_FORMAT_MOVE_TO;\n" +
                "    var pieceMoveDistance = getPieceMoveDistance(fromCell, null);\n" +
                "    if (pieceMoveDistance === 0 || isMyPiece(fromCell, myColor, null) != TRUE || isMyPiece(toCell, myColor, null) === TRUE)\n" +
                "        return FALSE;\n" +
                "    if ((Math.abs(cellToRow(fromCell) - cellToRow(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance)\n" +
                "        || (Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance))\n" +
                "        return FALSE;\n" +
                "    return TRUE;\n" +
                "}\n" +
                "function isCellValid(arg1, arg2) {\n" +
                "    // isCellValid(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        if (cell === null || cell.length != 2)\n" +
                "            return ERR_FORMAT;\n" +
                "        var colChar = cell.charAt(0);\n" +
                "        var rowChar = cell.charAt(1);\n" +
                "        if (colChar < 'A' || colChar > 'J')\n" +
                "            return ERR_INVALID_COL;\n" +
                "        if (rowChar < '0' || rowChar > '9')\n" +
                "            return ERR_INVALID_ROW;\n" +
                "        return TRUE;\n" +
                "    }\n" +
                "    // isCellVAlid(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    if (col < 0 || col > 9)\n" +
                "        return ERR_INVALID_COL;\n" +
                "    if (row < 0 || row > 9)\n" +
                "        return ERR_INVALID_ROW;\n" +
                "    return TRUE;\n" +
                "}\n" +
                "\n" +
                "//MaliciousAI2 tries to move the left 4 in a triangle\n" +
                "function getMove() {\n" +
                "    var board = getBoard();\n" +
                "    var pieceLocations = getMyPieceLocations(getMyColor());\n" +
                "\n" +
                "    if (getMyColor() === 0) {    //we are playing white\n" +
                "        if (board[4][9] === (\"w4\")) {\n" +
                "            return \"E9, E5\";\n" +
                "        } else if (board[4][5] === (\"w4\")) {\n" +
                "            return \"E5, A5\";\n" +
                "        } else {\n" +
                "            return \"A5, E9\"\n" +
                "        }\n" +
                "    } else {                            //we are playing black\n" +
                "        if (board[4][0] === (\"b4\")) {\n" +
                "            return \"E0, E4\";\n" +
                "        } else if (board[4][4] === (\"b4\")) {\n" +
                "            return \"E4, A4\";\n" +
                "        } else {\n" +
                "            return \"A4, E0\";\n" +
                "        }\n" +
                "    }\n" +
                "}";

        String m3 = "// cell values are NEVER null - they should be \"\" if empty\n" +
                "var NUM_PIECES_PER_SIDE = 20; // int\n" +
                "var NUM_PAWNS_PER_SIDE = 9; // int\n" +
                "var BOARD_LENGTH = 10; // int\n" +
                "var MIN_MOVE_DISTANCE = 1; // int\n" +
                "var MAX_MOVE_DISTANCE = 4; // int\n" +
                "var WHITE_CHAR = 'w'; // char\n" +
                "var BLACK_CHAR = 'b'; // char\n" +
                "var VALID_MOVES_ARRAY_LENGTH = 81; // int\n" +
                "var TRUE = 1; // int\n" +
                "var FALSE = 0; // int\n" +
                "var WHITE = 0; // int\n" +
                "var BLACK = 1; // int\n" +
                "var NO_PIECE = -1; // int\n" +
                "var ERR_INVALID_COLOR = -2; // int\n" +
                "var ERR_INVALID_COL = -3; // int\n" +
                "var ERR_INVALID_ROW = -4; // int\n" +
                "var ERR_FORMAT = -5; // int\n" +
                "var ERR_FORMAT_MOVE_FROM = -6; // int\n" +
                "var ERR_FORMAT_MOVE_TO = -7; // int\n" +
                "var GameState = /** @class */ (function () {\n" +
                "    function GameState() {\n" +
                "        this.currentPlayer = 0;\n" +
                "        this.numWhitePieces = 20;\n" +
                "        this.numBlackPieces = 20;\n" +
                "        this.numWhitePawns = 9;\n" +
                "        this.numBlackPawns = 9;\n" +
                "        this.numMovesMade = 0;\n" +
                "        var col9 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w3\");\n" +
                "        var col8 = new Array(\"b3\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w3\");\n" +
                "        var col7 = new Array(\"b2\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w2\");\n" +
                "        var col6 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        var col5 = new Array(\"b4\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w4\");\n" +
                "        var col4 = new Array(\"b4\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w4\");\n" +
                "        var col3 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        var col2 = new Array(\"b2\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w2\");\n" +
                "        var col1 = new Array(\"b3\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w3\");\n" +
                "        var col0 = new Array(\"b3\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        this.board = new Array(col9, col8, col7, col6, col5, col4, col3, col2, col1, col0);\n" +
                "    }\n" +
                "    return GameState;\n" +
                "}());\n" +
                "/**\n" +
                " * @return {string[][]} -           The String[][] representation of the game\n" +
                " board, comprised of ‘cells’, as described\n" +
                " at the top of this doc.\n" +
                " */\n" +
                "function getBoard() {\n" +
                "    return gameState.board;\n" +
                "}\n" +
                "/**\n" +
                " * @return {number}\t-\t  \t An integer representing the color of\n" +
                " * \t\t\t\t \t the current player.\n" +
                " * \t\t\t\t \t 0 = WHITE  and  1 = BLACK\n" +
                " */\n" +
                "function getMyColor() {\n" +
                "    return gameState.currentPlayer;\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {number} myColor - An integer representing the color of\n" +
                " * \t\t\t\t \t the not current player.\n" +
                " * @returns {number}\t-\t  \t An integer representing the color of\n" +
                " * \t\t\t\t \t the not current player.\n" +
                " * \t\t\t\t \t 0 = WHITE  and  1 = BLACK\n" +
                " * \t\t\t\t \t Returns a negative integer, ERR_INVALID_COLOR,\n" +
                " * \t\t\t\t \t if myColor is invalid\n" +
                " */\n" +
                "function getOpponentColor(myColor) {\n" +
                "    if (myColor === WHITE)\n" +
                "        return BLACK;\n" +
                "    else if (myColor === BLACK)\n" +
                "        return WHITE;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "}\n" +
                "function getCellValue(arg1, arg2) {\n" +
                "    // getCellValue(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var foundVal = getCellValue(cellToCol(cell), cellToRow(cell));\n" +
                "        if (foundVal === null || foundVal.length != 2)\n" +
                "            return \"\";\n" +
                "        return foundVal;\n" +
                "    }\n" +
                "    // getCellValue(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var board = gameState.board;\n" +
                "    return board[col][row];\n" +
                "}\n" +
                "/*\n" +
                "--------------------\n" +
                "    Array Indexing\n" +
                "--------------------\n" +
                "*/\n" +
                "/**\n" +
                " * @param {string}  cell -   The position of the cell on the board, from values “A0” to “J9”.\n" +
                " *\n" +
                " * @return {number} -       The index of the target cell’s column in the\n" +
                " *\t\t\t\t String[][] board.\n" +
                " *                Returns a negative integer if an error occurs.\n" +
                " *\n" +
                " * \t\t         Returns ERR_INVALID_COL if cell's column\n" +
                " *                is a character outside of the range A-J.\n" +
                " *                Returns ERR_INVALID_ROW if cell's row\n" +
                " *                is a character outside of the range 0-9.\n" +
                " *                Returns ERR_FORMAT if the cell is\n" +
                " *                otherwise improperly formatted.\n" +
                " */\n" +
                "function cellToCol(cell) {\n" +
                "    var isCellValidRet = isCellValid(cell, null);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return cellToColChar(cell) - 'A'.charCodeAt(0);\n" +
                "}\n" +
                "/**\n" +
                " * @param {string} cell -  The position of the cell on the board, from\n" +
                " * \t\t\t\t values “A0” to “J9”.\n" +
                " * @return {number} -       The index of the target cell’s row in the\n" +
                " *\t\t\t\t String[][] board.\n" +
                " *                Returns a negative integer if an error occurs.\n" +
                " *\n" +
                " * \t\t         Returns ERR_INVALID_COL if cell's column\n" +
                " *                is a character outside of the range A-J.\n" +
                " *                Returns ERR_INVALID_ROW if cell's row\n" +
                " *                is a character outside of the range 0-9.\n" +
                " *                Returns ERR_FORMAT if the cell is\n" +
                " *                otherwise improperly formatted.\n" +
                " */\n" +
                "function cellToRow(cell) {\n" +
                "    var isCellValidRet = isCellValid(cell, null);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return parseInt(cell.substring(1));\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {string} cell - The position of the cell on the board, from\n" +
                " * \t\t\t\t values \"A0\" to \"J9\".\n" +
                " *\n" +
                " * @return {number} -     The column of the cell on the board, from\n" +
                " * \t\t\t\t characters A-J as an ASCII integer.\n" +
                " *\n" +
                " *\t\t\t\t See Board documention\n" +
                " */\n" +
                "function cellToColChar(cell) {\n" +
                "    return cell.charCodeAt(0);\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {string} cell - The position of the cell on the board, from\n" +
                " * \t\t\t\t values \"A0\" to \"J9\".\n" +
                " * @return {number} -     The row of the cell on the board, from\n" +
                " * \t\t\t\t characters A-J as an ASCII number.\n" +
                " *\n" +
                " *\t\t\t\t See Board documention\n" +
                " */\n" +
                "function cellToRowChar(cell) {\n" +
                "    return cell.charCodeAt(1);\n" +
                "}\n" +
                "/*\n" +
                "----------------------\n" +
                "Array Index Conversion\n" +
                "----------------------\n" +
                "*/\n" +
                "/**\n" +
                " * @param {number} col -   The index of the target col’s row in the\n" +
                " * \t\t\t\t String[][] board.\n" +
                " *\n" +
                " * @return {string} -      The column of the cell on the board, from\n" +
                " *\t\t\t\t characters A-J. See diagram at top of doc as a string of length 1.\n" +
                " */\n" +
                "function colToColChar(col) {\n" +
                "    return String.fromCharCode(col + 'A'.charCodeAt(0));\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} row -   The index of the target row’s row in the\n" +
                " * \t\t\t\t String[][] board.\n" +
                " *\n" +
                " * @return {string} -      The row of the cell on the board, from\n" +
                " *\t\t\t\t characters 0-9. See diagram at top of doc as a string of length 1.\n" +
                " */\n" +
                "function rowToRowChar(row) {\n" +
                "    return (\"\" + row).charAt(0);\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} col -   The index of the target cell’s column in the\n" +
                " * \t\t\t\t String[][] board, retrieved through using\n" +
                " * \t\t\t\t cellToCol().\n" +
                " * @param {number} row -   The index of the target cell’s row in the\n" +
                " * \t\t\t\t String[][] board, retrieved through using\n" +
                " * \t\t\t\t cellToRow().\n" +
                " * @return {string}       The two-character position of the cell on the\n" +
                " * \t\t\t\t board, from values “A0” to “J9”, that\n" +
                " * \t\t\t\t corresponds to the passed row and column\n" +
                " * \t\t\t\t indices.\n" +
                " *\t\t\t \t For example, colAndRowToCell(2, 4) returns “C4”\n" +
                " */\n" +
                "function colAndRowToCell(col, row) {\n" +
                "    return \"\" + colToColChar(col) + rowToRowChar(row);\n" +
                "}\n" +
                "function cellHasPiece(arg1, arg2) {\n" +
                "    // cellHasPiece(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass to overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // cellHasPiece(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return !(getCellValue(col, row) === \"\") ? TRUE : FALSE;\n" +
                "}\n" +
                "function isMyPiece(arg1, arg2, arg3) {\n" +
                "    // isMyPiece(cell, myColor, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass to overload\n" +
                "        arg3 = arg2;\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // isMyPiece(col, row, myColor)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return getPieceColor(col, row) === myColor ? TRUE : FALSE;\n" +
                "}\n" +
                "function getPieceColor(arg1, arg2) {\n" +
                "    // getPieceColor(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // getPieceColor(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    if (cellHasPiece(col, row) === FALSE)\n" +
                "        return NO_PIECE;\n" +
                "    var cellVal = getCellValue(col, row);\n" +
                "    var colorChar = cellVal.charAt(0);\n" +
                "    var returnColor;\n" +
                "    if (colorChar === WHITE_CHAR)\n" +
                "        returnColor = WHITE;\n" +
                "    else if (colorChar === BLACK_CHAR)\n" +
                "        returnColor = BLACK;\n" +
                "    else\n" +
                "        returnColor = NO_PIECE;\n" +
                "    return returnColor;\n" +
                "}\n" +
                "function getPieceMoveDistance(arg1, arg2) {\n" +
                "    // getPieceMoveDistance(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // getPieceMoveDistance(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    if (cellHasPiece(col, row) === FALSE)\n" +
                "        return 0;\n" +
                "    var cellVal = getCellValue(col, row);\n" +
                "    return parseInt(cellVal.substring(1));\n" +
                "}\n" +
                "/*\n" +
                "--------------------\n" +
                "    Strategy Helpers\n" +
                "--------------------\n" +
                "*/\n" +
                "/**\n" +
                " *\n" +
                " * @param {number} color - An integer representing the color of\n" +
                " * \t\t\t\t the current player.\n" +
                " * @return\t{string[]}\t- An array of cells that pieces of the specified\n" +
                " * \t\t\t\t color are in.  The array is of fixed length 20,\n" +
                " * \t\t\t\t with empty array entries having the value \"\".\n" +
                " */\n" +
                "function getMyPieceLocations(color) {\n" +
                "    var locations = new Array(NUM_PIECES_PER_SIDE);\n" +
                "    for (var i = 0; i < NUM_PIECES_PER_SIDE; i++)\n" +
                "        locations[i] = \"\";\n" +
                "    var curArrIndex = 0;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        for (var j = 0; j < BOARD_LENGTH; j++) {\n" +
                "            if (isMyPiece(i, j, color) === TRUE) {\n" +
                "                locations[curArrIndex] = colAndRowToCell(i, j);\n" +
                "                curArrIndex++;\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "    return locations;\n" +
                "}\n" +
                "function getValidMoves(arg1, arg2, arg3) {\n" +
                "    // getValidMoves(cell, myColor, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg3 = arg2;\n" +
                "        arg2 = cellToRow(cell);\n" +
                "        arg1 = cellToCol(cell);\n" +
                "    }\n" +
                "    // getValidMoves(col, row, myColor);\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    var moves = new Array(VALID_MOVES_ARRAY_LENGTH);\n" +
                "    for (var i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {\n" +
                "        moves[i] = \"\";\n" +
                "    }\n" +
                "    var currentArrayIndex = 0;\n" +
                "    var moveDistance = getPieceMoveDistance(col, row);\n" +
                "    if (moveDistance <= 0)\n" +
                "        return moves;\n" +
                "    for (var i = -moveDistance; i <= moveDistance; i += moveDistance) { //William, you almost got it right. I just need to change two places in the code, i++ and j++\n" +
                "        for (var j = -moveDistance; j <= moveDistance; j += moveDistance) { //to i += moveDistance and j += moveDistance ! Plus corresponding code in SimulationApp\n" +
                "            var newCol = col + i;\n" +
                "            var newRow = row + j;\n" +
                "            if ((isCellValid(newCol, newRow) === TRUE)\n" +
                "                && isMyPiece(newCol, newRow, myColor) != TRUE) {\n" +
                "                var pieceColor = getPieceColor(col, row);\n" +
                "                /*if (isPlayerInCheck(pieceColor) === TRUE && ((pieceColor === WHITE && row != 0) || (pieceColor === BLACK && row != 9)))\n" +
                "                    continue;*/\n" +
                "                if (isPlayerInCheck(pieceColor) === TRUE) {\n" +
                "                    var columnInCheck = whichColumnIsPlayerInCheck(pieceColor);\n" +
                "                    var rowToCheck = (pieceColor === WHITE) ? 9 : 0;\n" +
                "                    if (newCol != columnInCheck || newRow != rowToCheck)\n" +
                "                        continue;\n" +
                "                }\n" +
                "                moves[currentArrayIndex] = colAndRowToCell(newCol, newRow);\n" +
                "                currentArrayIndex++;\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "    return moves;\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} color - An integer representing the color of\n" +
                " * \t\t\t     the current player.\n" +
                " * \t\t\t     0 = WHITE  and  1 = BLACK\n" +
                "\n" +
                " * @return {number} -      Returns TRUE if the given player’s opponent has\n" +
                " gotten a 1-piece of theirs to the given\n" +
                " player’s starting side of the board.  Only\n" +
                " moves that capture this 1-piece will be valid,\n" +
                " and failure to capture it will result in a\n" +
                " checkmate.\n" +
                " Returns FALSE if the given player’s opponent\n" +
                " does not meet the above condition.\n" +
                " Returns a negative integer if an\n" +
                " error occurs.\n" +
                "\n" +
                " * \t\t         Returns ERR_INVALID_COLOR if the passed color\n" +
                " is not WHITE or BLACK.\n" +
                " */\n" +
                "// similar func in GameState\n" +
                "function isPlayerInCheck(color) {\n" +
                "    var rowToCheck;\n" +
                "    if (color === WHITE)\n" +
                "        rowToCheck = 9;\n" +
                "    else if (color === BLACK)\n" +
                "        rowToCheck = 0;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))\n" +
                "            && (getPieceMoveDistance(i, rowToCheck) === 1))\n" +
                "            return TRUE;\n" +
                "    }\n" +
                "    return FALSE;\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} color  An integer representing the color of\n" +
                " * \t\t\t     the current player.\n" +
                " * \t\t\t     0 = WHITE  and  1 = BLACK\n" +
                "\n" +
                " * @return {number} -      Assumes the given player’s opponent has\n" +
                " gotten a 1-piece of theirs to the given\n" +
                " player’s starting side of the board, and returns the column that 1-piece is in.  Only\n" +
                " moves that capture this 1-piece will be valid,\n" +
                " and failure to capture it will result in a\n" +
                " checkmate.\n" +
                " Returns a negative integer if an\n" +
                " error occurs.\n" +
                "\n" +
                " Returns NO_PIECE if the given player’s opponent\n" +
                " does not meet the above condition.\n" +
                "\n" +
                " * \t\t         Returns ERR_INVALID_COLOR if the passed color\n" +
                " is not WHITE or BLACK.\n" +
                " */\n" +
                "function whichColumnIsPlayerInCheck(color) {\n" +
                "    var rowToCheck;\n" +
                "    if (color === WHITE)\n" +
                "        rowToCheck = 9;\n" +
                "    else if (color === BLACK)\n" +
                "        rowToCheck = 0;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))\n" +
                "            && (getPieceMoveDistance(i, rowToCheck) === 1))\n" +
                "            return i;\n" +
                "    }\n" +
                "    return NO_PIECE;\n" +
                "}\n" +
                "function isMoveValid(arg1, arg2, arg3) {\n" +
                "    // isMoveValid(moveString, myColor, unusedParam)\n" +
                "    if (typeof arg2 === 'number') {\n" +
                "        var moveString = arg1;\n" +
                "        var moveCells = moveString.split(\", \");\n" +
                "        if (moveCells.length != 2)\n" +
                "            return ERR_FORMAT;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg3 = arg2;\n" +
                "        arg1 = moveCells[0];\n" +
                "        arg2 = moveCells[1];\n" +
                "    }\n" +
                "    // isMoveValid(fromCell, toCell, myColor)\n" +
                "    var fromCell = arg1;\n" +
                "    var toCell = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    if (fromCell === null || toCell === null || fromCell.length != 2 || toCell.length != 2)\n" +
                "        return ERR_FORMAT;\n" +
                "    var cellValidRet = isCellValid(fromCell, null);\n" +
                "    if (cellValidRet != TRUE)\n" +
                "        return ERR_FORMAT_MOVE_FROM;\n" +
                "    cellValidRet = isCellValid(toCell, null);\n" +
                "    if (cellValidRet != TRUE)\n" +
                "        return ERR_FORMAT_MOVE_TO;\n" +
                "    var pieceMoveDistance = getPieceMoveDistance(fromCell, null);\n" +
                "    if (pieceMoveDistance === 0 || isMyPiece(fromCell, myColor, null) != TRUE || isMyPiece(toCell, myColor, null) === TRUE)\n" +
                "        return FALSE;\n" +
                "    if ((Math.abs(cellToRow(fromCell) - cellToRow(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance)\n" +
                "        || (Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance))\n" +
                "        return FALSE;\n" +
                "    return TRUE;\n" +
                "}\n" +
                "function isCellValid(arg1, arg2) {\n" +
                "    // isCellValid(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        if (cell === null || cell.length != 2)\n" +
                "            return ERR_FORMAT;\n" +
                "        var colChar = cell.charAt(0);\n" +
                "        var rowChar = cell.charAt(1);\n" +
                "        if (colChar < 'A' || colChar > 'J')\n" +
                "            return ERR_INVALID_COL;\n" +
                "        if (rowChar < '0' || rowChar > '9')\n" +
                "            return ERR_INVALID_ROW;\n" +
                "        return TRUE;\n" +
                "    }\n" +
                "    // isCellVAlid(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    if (col < 0 || col > 9)\n" +
                "        return ERR_INVALID_COL;\n" +
                "    if (row < 0 || row > 9)\n" +
                "        return ERR_INVALID_ROW;\n" +
                "    return TRUE;\n" +
                "}\n" +
                "\n" +
                "//MaliciousAI3 tries to first capture a 1 using the right 4, THEN move the left 4 in a triangle\n" +
                "function getMove() {\n" +
                "    var board = getBoard();\n" +
                "    var pieceLocations = getMyPieceLocations(getMyColor());\n" +
                "\n" +
                "    if (getMyColor() === 0) {    //we are playing white\n" +
                "        if (board[5][1] === \"w4\") {\n" +
                "            if (board[4][9] === (\"w4\")) {\n" +
                "                return \"E9, E5\";\n" +
                "            } else if (board[4][5] === (\"w4\")) {\n" +
                "                return \"E5, A5\";\n" +
                "            } else {\n" +
                "                return \"A5, E9\"\n" +
                "            }\n" +
                "        } else if (board[5][5] === \"w4\") {\n" +
                "            return \"F5, F1\";\n" +
                "        } else {\n" +
                "            return \"F9, F5\";\n" +
                "        }\n" +
                "    } else {                            //we are playing black\n" +
                "        if (board[5][8] === \"b4\") {\n" +
                "            if (board[4][0] === (\"b4\")) {\n" +
                "                return \"E0, E4\";\n" +
                "            } else if (board[4][4] === (\"b4\")) {\n" +
                "                return \"E4, A4\";\n" +
                "            } else {\n" +
                "                return \"A4, E0\";\n" +
                "            }\n" +
                "        } else if (board[5][4] === \"b4\") {\n" +
                "            return \"F4, F8\";\n" +
                "        } else {\n" +
                "            return \"F0, F4\";\n" +
                "        }\n" +
                "    }\n" +
                "}";

        String m4 = "// cell values are NEVER null - they should be \"\" if empty\n" +
                "var NUM_PIECES_PER_SIDE = 20; // int\n" +
                "var NUM_PAWNS_PER_SIDE = 9; // int\n" +
                "var BOARD_LENGTH = 10; // int\n" +
                "var MIN_MOVE_DISTANCE = 1; // int\n" +
                "var MAX_MOVE_DISTANCE = 4; // int\n" +
                "var WHITE_CHAR = 'w'; // char\n" +
                "var BLACK_CHAR = 'b'; // char\n" +
                "var VALID_MOVES_ARRAY_LENGTH = 81; // int\n" +
                "var TRUE = 1; // int\n" +
                "var FALSE = 0; // int\n" +
                "var WHITE = 0; // int\n" +
                "var BLACK = 1; // int\n" +
                "var NO_PIECE = -1; // int\n" +
                "var ERR_INVALID_COLOR = -2; // int\n" +
                "var ERR_INVALID_COL = -3; // int\n" +
                "var ERR_INVALID_ROW = -4; // int\n" +
                "var ERR_FORMAT = -5; // int\n" +
                "var ERR_FORMAT_MOVE_FROM = -6; // int\n" +
                "var ERR_FORMAT_MOVE_TO = -7; // int\n" +
                "var GameState = /** @class */ (function () {\n" +
                "    function GameState() {\n" +
                "        this.currentPlayer = 0;\n" +
                "        this.numWhitePieces = 20;\n" +
                "        this.numBlackPieces = 20;\n" +
                "        this.numWhitePawns = 9;\n" +
                "        this.numBlackPawns = 9;\n" +
                "        this.numMovesMade = 0;\n" +
                "        var col9 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w3\");\n" +
                "        var col8 = new Array(\"b3\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w3\");\n" +
                "        var col7 = new Array(\"b2\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w2\");\n" +
                "        var col6 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        var col5 = new Array(\"b4\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w4\");\n" +
                "        var col4 = new Array(\"b4\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w4\");\n" +
                "        var col3 = new Array(\"b1\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        var col2 = new Array(\"b2\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w2\");\n" +
                "        var col1 = new Array(\"b3\", \"b2\", \"\", \"\", \"\", \"\", \"\", \"\", \"w2\", \"w3\");\n" +
                "        var col0 = new Array(\"b3\", \"b1\", \"\", \"\", \"\", \"\", \"\", \"\", \"w1\", \"w1\");\n" +
                "        this.board = new Array(col9, col8, col7, col6, col5, col4, col3, col2, col1, col0);\n" +
                "    }\n" +
                "    return GameState;\n" +
                "}());\n" +
                "/**\n" +
                " * @return {string[][]} -           The String[][] representation of the game\n" +
                " board, comprised of ‘cells’, as described\n" +
                " at the top of this doc.\n" +
                " */\n" +
                "function getBoard() {\n" +
                "    return gameState.board;\n" +
                "}\n" +
                "/**\n" +
                " * @return {number}\t-\t  \t An integer representing the color of\n" +
                " * \t\t\t\t \t the current player.\n" +
                " * \t\t\t\t \t 0 = WHITE  and  1 = BLACK\n" +
                " */\n" +
                "function getMyColor() {\n" +
                "    return gameState.currentPlayer;\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {number} myColor - An integer representing the color of\n" +
                " * \t\t\t\t \t the not current player.\n" +
                " * @returns {number}\t-\t  \t An integer representing the color of\n" +
                " * \t\t\t\t \t the not current player.\n" +
                " * \t\t\t\t \t 0 = WHITE  and  1 = BLACK\n" +
                " * \t\t\t\t \t Returns a negative integer, ERR_INVALID_COLOR,\n" +
                " * \t\t\t\t \t if myColor is invalid\n" +
                " */\n" +
                "function getOpponentColor(myColor) {\n" +
                "    if (myColor === WHITE)\n" +
                "        return BLACK;\n" +
                "    else if (myColor === BLACK)\n" +
                "        return WHITE;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "}\n" +
                "function getCellValue(arg1, arg2) {\n" +
                "    // getCellValue(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var foundVal = getCellValue(cellToCol(cell), cellToRow(cell));\n" +
                "        if (foundVal === null || foundVal.length != 2)\n" +
                "            return \"\";\n" +
                "        return foundVal;\n" +
                "    }\n" +
                "    // getCellValue(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var board = gameState.board;\n" +
                "    return board[col][row];\n" +
                "}\n" +
                "/*\n" +
                "--------------------\n" +
                "    Array Indexing\n" +
                "--------------------\n" +
                "*/\n" +
                "/**\n" +
                " * @param {string}  cell -   The position of the cell on the board, from values “A0” to “J9”.\n" +
                " *\n" +
                " * @return {number} -       The index of the target cell’s column in the\n" +
                " *\t\t\t\t String[][] board.\n" +
                " *                Returns a negative integer if an error occurs.\n" +
                " *\n" +
                " * \t\t         Returns ERR_INVALID_COL if cell's column\n" +
                " *                is a character outside of the range A-J.\n" +
                " *                Returns ERR_INVALID_ROW if cell's row\n" +
                " *                is a character outside of the range 0-9.\n" +
                " *                Returns ERR_FORMAT if the cell is\n" +
                " *                otherwise improperly formatted.\n" +
                " */\n" +
                "function cellToCol(cell) {\n" +
                "    var isCellValidRet = isCellValid(cell, null);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return cellToColChar(cell) - 'A'.charCodeAt(0);\n" +
                "}\n" +
                "/**\n" +
                " * @param {string} cell -  The position of the cell on the board, from\n" +
                " * \t\t\t\t values “A0” to “J9”.\n" +
                " * @return {number} -       The index of the target cell’s row in the\n" +
                " *\t\t\t\t String[][] board.\n" +
                " *                Returns a negative integer if an error occurs.\n" +
                " *\n" +
                " * \t\t         Returns ERR_INVALID_COL if cell's column\n" +
                " *                is a character outside of the range A-J.\n" +
                " *                Returns ERR_INVALID_ROW if cell's row\n" +
                " *                is a character outside of the range 0-9.\n" +
                " *                Returns ERR_FORMAT if the cell is\n" +
                " *                otherwise improperly formatted.\n" +
                " */\n" +
                "function cellToRow(cell) {\n" +
                "    var isCellValidRet = isCellValid(cell, null);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return parseInt(cell.substring(1));\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {string} cell - The position of the cell on the board, from\n" +
                " * \t\t\t\t values \"A0\" to \"J9\".\n" +
                " *\n" +
                " * @return {number} -     The column of the cell on the board, from\n" +
                " * \t\t\t\t characters A-J as an ASCII integer.\n" +
                " *\n" +
                " *\t\t\t\t See Board documention\n" +
                " */\n" +
                "function cellToColChar(cell) {\n" +
                "    return cell.charCodeAt(0);\n" +
                "}\n" +
                "/**\n" +
                " *\n" +
                " * @param {string} cell - The position of the cell on the board, from\n" +
                " * \t\t\t\t values \"A0\" to \"J9\".\n" +
                " * @return {number} -     The row of the cell on the board, from\n" +
                " * \t\t\t\t characters A-J as an ASCII number.\n" +
                " *\n" +
                " *\t\t\t\t See Board documention\n" +
                " */\n" +
                "function cellToRowChar(cell) {\n" +
                "    return cell.charCodeAt(1);\n" +
                "}\n" +
                "/*\n" +
                "----------------------\n" +
                "Array Index Conversion\n" +
                "----------------------\n" +
                "*/\n" +
                "/**\n" +
                " * @param {number} col -   The index of the target col’s row in the\n" +
                " * \t\t\t\t String[][] board.\n" +
                " *\n" +
                " * @return {string} -      The column of the cell on the board, from\n" +
                " *\t\t\t\t characters A-J. See diagram at top of doc as a string of length 1.\n" +
                " */\n" +
                "function colToColChar(col) {\n" +
                "    return String.fromCharCode(col + 'A'.charCodeAt(0));\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} row -   The index of the target row’s row in the\n" +
                " * \t\t\t\t String[][] board.\n" +
                " *\n" +
                " * @return {string} -      The row of the cell on the board, from\n" +
                " *\t\t\t\t characters 0-9. See diagram at top of doc as a string of length 1.\n" +
                " */\n" +
                "function rowToRowChar(row) {\n" +
                "    return (\"\" + row).charAt(0);\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} col -   The index of the target cell’s column in the\n" +
                " * \t\t\t\t String[][] board, retrieved through using\n" +
                " * \t\t\t\t cellToCol().\n" +
                " * @param {number} row -   The index of the target cell’s row in the\n" +
                " * \t\t\t\t String[][] board, retrieved through using\n" +
                " * \t\t\t\t cellToRow().\n" +
                " * @return {string}       The two-character position of the cell on the\n" +
                " * \t\t\t\t board, from values “A0” to “J9”, that\n" +
                " * \t\t\t\t corresponds to the passed row and column\n" +
                " * \t\t\t\t indices.\n" +
                " *\t\t\t \t For example, colAndRowToCell(2, 4) returns “C4”\n" +
                " */\n" +
                "function colAndRowToCell(col, row) {\n" +
                "    return \"\" + colToColChar(col) + rowToRowChar(row);\n" +
                "}\n" +
                "function cellHasPiece(arg1, arg2) {\n" +
                "    // cellHasPiece(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass to overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // cellHasPiece(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return !(getCellValue(col, row) === \"\") ? TRUE : FALSE;\n" +
                "}\n" +
                "function isMyPiece(arg1, arg2, arg3) {\n" +
                "    // isMyPiece(cell, myColor, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass to overload\n" +
                "        arg3 = arg2;\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // isMyPiece(col, row, myColor)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    return getPieceColor(col, row) === myColor ? TRUE : FALSE;\n" +
                "}\n" +
                "function getPieceColor(arg1, arg2) {\n" +
                "    // getPieceColor(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // getPieceColor(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    if (cellHasPiece(col, row) === FALSE)\n" +
                "        return NO_PIECE;\n" +
                "    var cellVal = getCellValue(col, row);\n" +
                "    var colorChar = cellVal.charAt(0);\n" +
                "    var returnColor;\n" +
                "    if (colorChar === WHITE_CHAR)\n" +
                "        returnColor = WHITE;\n" +
                "    else if (colorChar === BLACK_CHAR)\n" +
                "        returnColor = BLACK;\n" +
                "    else\n" +
                "        returnColor = NO_PIECE;\n" +
                "    return returnColor;\n" +
                "}\n" +
                "function getPieceMoveDistance(arg1, arg2) {\n" +
                "    // getPieceMoveDistance(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        var isCellValidRet = isCellValid(cell, null);\n" +
                "        if (isCellValidRet != TRUE)\n" +
                "            return isCellValidRet;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg1 = cellToCol(cell);\n" +
                "        arg2 = cellToRow(cell);\n" +
                "    }\n" +
                "    // getPieceMoveDistance(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var isCellValidRet = isCellValid(col, row);\n" +
                "    if (isCellValidRet != TRUE)\n" +
                "        return isCellValidRet;\n" +
                "    if (cellHasPiece(col, row) === FALSE)\n" +
                "        return 0;\n" +
                "    var cellVal = getCellValue(col, row);\n" +
                "    return parseInt(cellVal.substring(1));\n" +
                "}\n" +
                "/*\n" +
                "--------------------\n" +
                "    Strategy Helpers\n" +
                "--------------------\n" +
                "*/\n" +
                "/**\n" +
                " *\n" +
                " * @param {number} color - An integer representing the color of\n" +
                " * \t\t\t\t the current player.\n" +
                " * @return\t{string[]}\t- An array of cells that pieces of the specified\n" +
                " * \t\t\t\t color are in.  The array is of fixed length 20,\n" +
                " * \t\t\t\t with empty array entries having the value \"\".\n" +
                " */\n" +
                "function getMyPieceLocations(color) {\n" +
                "    var locations = new Array(NUM_PIECES_PER_SIDE);\n" +
                "    for (var i = 0; i < NUM_PIECES_PER_SIDE; i++)\n" +
                "        locations[i] = \"\";\n" +
                "    var curArrIndex = 0;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        for (var j = 0; j < BOARD_LENGTH; j++) {\n" +
                "            if (isMyPiece(i, j, color) === TRUE) {\n" +
                "                locations[curArrIndex] = colAndRowToCell(i, j);\n" +
                "                curArrIndex++;\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "    return locations;\n" +
                "}\n" +
                "function getValidMoves(arg1, arg2, arg3) {\n" +
                "    // getValidMoves(cell, myColor, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg3 = arg2;\n" +
                "        arg2 = cellToRow(cell);\n" +
                "        arg1 = cellToCol(cell);\n" +
                "    }\n" +
                "    // getValidMoves(col, row, myColor);\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    var moves = new Array(VALID_MOVES_ARRAY_LENGTH);\n" +
                "    for (var i = 0; i < VALID_MOVES_ARRAY_LENGTH; i++) {\n" +
                "        moves[i] = \"\";\n" +
                "    }\n" +
                "    var currentArrayIndex = 0;\n" +
                "    var moveDistance = getPieceMoveDistance(col, row);\n" +
                "    if (moveDistance <= 0)\n" +
                "        return moves;\n" +
                "    for (var i = -moveDistance; i <= moveDistance; i += moveDistance) { //William, you almost got it right. I just need to change two places in the code, i++ and j++\n" +
                "        for (var j = -moveDistance; j <= moveDistance; j += moveDistance) { //to i += moveDistance and j += moveDistance ! Plus corresponding code in SimulationApp\n" +
                "            var newCol = col + i;\n" +
                "            var newRow = row + j;\n" +
                "            if ((isCellValid(newCol, newRow) === TRUE)\n" +
                "                && isMyPiece(newCol, newRow, myColor) != TRUE) {\n" +
                "                var pieceColor = getPieceColor(col, row);\n" +
                "                /*if (isPlayerInCheck(pieceColor) === TRUE && ((pieceColor === WHITE && row != 0) || (pieceColor === BLACK && row != 9)))\n" +
                "                    continue;*/\n" +
                "                if (isPlayerInCheck(pieceColor) === TRUE) {\n" +
                "                    var columnInCheck = whichColumnIsPlayerInCheck(pieceColor);\n" +
                "                    var rowToCheck = (pieceColor === WHITE) ? 9 : 0;\n" +
                "                    if (newCol != columnInCheck || newRow != rowToCheck)\n" +
                "                        continue;\n" +
                "                }\n" +
                "                moves[currentArrayIndex] = colAndRowToCell(newCol, newRow);\n" +
                "                currentArrayIndex++;\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "    return moves;\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} color - An integer representing the color of\n" +
                " * \t\t\t     the current player.\n" +
                " * \t\t\t     0 = WHITE  and  1 = BLACK\n" +
                "\n" +
                " * @return {number} -      Returns TRUE if the given player’s opponent has\n" +
                " gotten a 1-piece of theirs to the given\n" +
                " player’s starting side of the board.  Only\n" +
                " moves that capture this 1-piece will be valid,\n" +
                " and failure to capture it will result in a\n" +
                " checkmate.\n" +
                " Returns FALSE if the given player’s opponent\n" +
                " does not meet the above condition.\n" +
                " Returns a negative integer if an\n" +
                " error occurs.\n" +
                "\n" +
                " * \t\t         Returns ERR_INVALID_COLOR if the passed color\n" +
                " is not WHITE or BLACK.\n" +
                " */\n" +
                "// similar func in GameState\n" +
                "function isPlayerInCheck(color) {\n" +
                "    var rowToCheck;\n" +
                "    if (color === WHITE)\n" +
                "        rowToCheck = 9;\n" +
                "    else if (color === BLACK)\n" +
                "        rowToCheck = 0;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))\n" +
                "            && (getPieceMoveDistance(i, rowToCheck) === 1))\n" +
                "            return TRUE;\n" +
                "    }\n" +
                "    return FALSE;\n" +
                "}\n" +
                "/**\n" +
                " * @param {number} color  An integer representing the color of\n" +
                " * \t\t\t     the current player.\n" +
                " * \t\t\t     0 = WHITE  and  1 = BLACK\n" +
                "\n" +
                " * @return {number} -      Assumes the given player’s opponent has\n" +
                " gotten a 1-piece of theirs to the given\n" +
                " player’s starting side of the board, and returns the column that 1-piece is in.  Only\n" +
                " moves that capture this 1-piece will be valid,\n" +
                " and failure to capture it will result in a\n" +
                " checkmate.\n" +
                " Returns a negative integer if an\n" +
                " error occurs.\n" +
                "\n" +
                " Returns NO_PIECE if the given player’s opponent\n" +
                " does not meet the above condition.\n" +
                "\n" +
                " * \t\t         Returns ERR_INVALID_COLOR if the passed color\n" +
                " is not WHITE or BLACK.\n" +
                " */\n" +
                "function whichColumnIsPlayerInCheck(color) {\n" +
                "    var rowToCheck;\n" +
                "    if (color === WHITE)\n" +
                "        rowToCheck = 9;\n" +
                "    else if (color === BLACK)\n" +
                "        rowToCheck = 0;\n" +
                "    else\n" +
                "        return ERR_INVALID_COLOR;\n" +
                "    for (var i = 0; i < BOARD_LENGTH; i++) {\n" +
                "        if ((getPieceColor(i, rowToCheck) === getOpponentColor(color))\n" +
                "            && (getPieceMoveDistance(i, rowToCheck) === 1))\n" +
                "            return i;\n" +
                "    }\n" +
                "    return NO_PIECE;\n" +
                "}\n" +
                "function isMoveValid(arg1, arg2, arg3) {\n" +
                "    // isMoveValid(moveString, myColor, unusedParam)\n" +
                "    if (typeof arg2 === 'number') {\n" +
                "        var moveString = arg1;\n" +
                "        var moveCells = moveString.split(\", \");\n" +
                "        if (moveCells.length != 2)\n" +
                "            return ERR_FORMAT;\n" +
                "        // sets up args to pass into overload\n" +
                "        arg3 = arg2;\n" +
                "        arg1 = moveCells[0];\n" +
                "        arg2 = moveCells[1];\n" +
                "    }\n" +
                "    // isMoveValid(fromCell, toCell, myColor)\n" +
                "    var fromCell = arg1;\n" +
                "    var toCell = arg2;\n" +
                "    var myColor = arg3;\n" +
                "    if (fromCell === null || toCell === null || fromCell.length != 2 || toCell.length != 2)\n" +
                "        return ERR_FORMAT;\n" +
                "    var cellValidRet = isCellValid(fromCell, null);\n" +
                "    if (cellValidRet != TRUE)\n" +
                "        return ERR_FORMAT_MOVE_FROM;\n" +
                "    cellValidRet = isCellValid(toCell, null);\n" +
                "    if (cellValidRet != TRUE)\n" +
                "        return ERR_FORMAT_MOVE_TO;\n" +
                "    var pieceMoveDistance = getPieceMoveDistance(fromCell, null);\n" +
                "    if (pieceMoveDistance === 0 || isMyPiece(fromCell, myColor, null) != TRUE || isMyPiece(toCell, myColor, null) === TRUE)\n" +
                "        return FALSE;\n" +
                "    if ((Math.abs(cellToRow(fromCell) - cellToRow(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance)\n" +
                "        || (Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != 0 && Math.abs(cellToCol(fromCell) - cellToCol(toCell)) != pieceMoveDistance))\n" +
                "        return FALSE;\n" +
                "    return TRUE;\n" +
                "}\n" +
                "function isCellValid(arg1, arg2) {\n" +
                "    // isCellValid(cell, unusedParam)\n" +
                "    if (typeof arg1 === 'string') {\n" +
                "        var cell = arg1;\n" +
                "        if (cell === null || cell.length != 2)\n" +
                "            return ERR_FORMAT;\n" +
                "        var colChar = cell.charAt(0);\n" +
                "        var rowChar = cell.charAt(1);\n" +
                "        if (colChar < 'A' || colChar > 'J')\n" +
                "            return ERR_INVALID_COL;\n" +
                "        if (rowChar < '0' || rowChar > '9')\n" +
                "            return ERR_INVALID_ROW;\n" +
                "        return TRUE;\n" +
                "    }\n" +
                "    // isCellVAlid(col, row)\n" +
                "    var col = arg1;\n" +
                "    var row = arg2;\n" +
                "    if (col < 0 || col > 9)\n" +
                "        return ERR_INVALID_COL;\n" +
                "    if (row < 0 || row > 9)\n" +
                "        return ERR_INVALID_ROW;\n" +
                "    return TRUE;\n" +
                "}\n" +
                "\n" +
                "//MaliciousAI4 tries to first capture a 2 using the right 4, THEN move the left 4 in a triangle\n" +
                "function getMove() {\n" +
                "    var board = getBoard();\n" +
                "    var pieceLocations = getMyPieceLocations(getMyColor());\n" +
                "\n" +
                "    if (getMyColor() === 0) {    //we are playing white\n" +
                //"        while (true) { }" +
                "        if (board[1][1] === \"w4\") {\n" +
                "            if (board[4][9] === (\"w4\")) {\n" +
                "                return \"E9, E5\";\n" +
                "            } else if (board[4][5] === (\"w4\")) {\n" +
                "                return \"E5, A5\";\n" +
                "            } else {\n" +
                "                return \"A5, E9\"\n" +
                "            }\n" +
                "        } else if (board[5][5] === \"w4\") {\n" +
                "            return \"F5, B1\";\n" +
                "        } else {\n" +
                "            return \"F9, F5\";\n" +
                "        }\n" +
                "    } else {                            //we are playing black\n" +
                "        if (board[1][8] === \"b4\") {\n" +
                "            if (board[4][0] === (\"b4\")) {\n" +
                "                return \"E0, E4\";\n" +
                "            } else if (board[4][4] === (\"b4\")) {\n" +
                "                return \"E4, A4\";\n" +
                "            } else {\n" +
                "                return \"A4, E0\";\n" +
                "            }\n" +
                "        } else if (board[5][4] === \"b4\") {\n" +
                "            return \"F4, B8\";\n" +
                "        } else {\n" +
                "            return \"F0, F4\";\n" +
                "        }\n" +
                "    }\n" +
                "}";

        if (num == 1)
            return m1;
        else if (num == 2)
            return m2;
        else if (num == 3)
            return m3;
        else
            return m4;
    }
}