package Simulation;

import API.Java.API;

import javax.script.ScriptEngine;
import javax.script.*;
import javax.swing.*;
import java.io.IOException;
import java.lang.reflect.Array;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.concurrent.TimeoutException;
import java.util.regex.MatchResult;
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

    // Runs a battle with an infinite number of BattleGames, starting a fresh
    // BattleGame when the previous completes
    public static void main(String[] args)
            throws IOException, TimeoutException, URISyntaxException, NoSuchAlgorithmException, KeyManagementException {

        if (9 * 7 - 2 > 0) {
            String testString = getRandomAIJS(); /*"//this is random text\n" +
                    "function getMove() {\n" +
                    //"var File = Java.type('java.io.File'); File;\n" +
                    "    if (true)\n" +
                    "       print(\"JS ifPrint\");\n" +
                    "    if (true && true) {\n" +
                    "       print(\"JS enclosed ifPrint\");\n" +
                    "    }\n" +
                    "    print(\"JS print\");\n" +
                    "    return \"A1, A2\";\n" +
                    "}";*/

            /*
            String regex = "^(.)$";//"^( \t)*(if|for|switch|while)( \t\n)*$" + Pattern.quote("(");// + "(.)+" + Pattern.quote(")";//"^(a|b|c)*$";
            boolean doesMatch = Pattern.matches(regex, testString);//structureMatcher.matches();
            System.out.println(testString + doesMatch);
            if (9 - 6 != 0)
                return;
            */
            try {
                evaluateSourceCode(testString);
            } catch (ScriptException e) {
                e.printStackTrace();
            }
            return;
        }

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
                prepareAndRunBattle(sentBattle);
                System.out.println("\n\nEnter number of games to simulate.  [must be odd!]");
            };

            // Sends callback to sender (1 manual player vs stock AI)
            DeliverCallback deliverCallbackManual = (consumerTag, delivery) -> {
                mostlyCurrentBattle = null;
                manualPlayStockId = null;
                String message = new String(delivery.getBody(), "UTF-8");
                System.out.println(" [x] Received '" + message + "'");

                // also initializes gameState upon success
                SimulationStepRequest manRequest = processMessageManual(message);
                initializeManualGameState(manRequest);
                manualPlayStockId = manRequest.chosenStockId;
                setupStrategies();
                Color potentialWinner = playTurn(true, null, null);
                String[][] responseBoard = addPieceIds(manRequest);
                SimulationStepResponse resp = new SimulationStepResponse(responseBoard, lastMoveString,
                        potentialWinner != null, Color.WHITE.equals(potentialWinner) != manRequest.isWhiteAI,
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
                Battle newBattle = new Battle(numGames, attackerIdString, defenderIdString);
                newBattle.id = UUID.randomUUID().toString();
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
    static void initializeManualGameState(SimulationStepRequest req) {
        String board[][] = req.sentBoard;
        gameState = new GameState();

        // override initialized fields
        gameState.numBlackPawns = 0;
        gameState.numBlackPieces = 0;
        gameState.numWhitePawns = 0;
        gameState.numWhitePieces = 0;

        gameState.currentPlayer = req.isWhiteAI ? 0 : 1;
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
    static String[][] addPieceIds(SimulationStepRequest req) {
        String[][] requestBoard = req.sentBoard;
        String[][] responseBoard = gameState.board;
        Color AIColor = req.isWhiteAI ? Color.WHITE : Color.BLACK;
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
                        && getPieceColor((new API()).colAndRowToCell(i, j), requestBoard).equals(AIColor)) { // if moved
                                                                                                             // from
                    preMovePieceString = requestVal;
                } else if (inResp && changed) { // if moved to
                    postMovePieceString = responseVal;
                    postMovePieceCol = i;
                    postMovePieceRow = j;
                }
            }
        }

        System.out.println("preMoveString: " + preMovePieceString + "  postMoveString: " + postMovePieceString
                + "  [c,r]: [" + postMovePieceCol + ", " + postMovePieceRow + "]");

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
        String[][] board;
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

        // expects message in format "<attackerStrategyID>,
        // <attackerStrategySourceCode>, <defenderStrategyID>,
        // <defenderStrategySourceCode>, <numberOfGames>"
        /*
         * String usage = "Message must be in format "
         * +
         * "\"<attackerStrategyID>, <attackerStrategySourceCode>, <defenderStrategyID>, <defenderStrategySourceCode>, <numberOfGames>\""
         * + "  -- EXAMPLE -- \"81703, { code; }, 92105, { code; }, 7\"\n";
         * String[] split = message.split(MESSAGE_DELIMITER);
         * if (split.length != 5) {
         * System.out.
         * printf("ERROR: message \"%s\" does not have the correct number of arguments.\n"
         * + usage, message);
         * return false;
         * }
         * if (split[0] == null) {
         * System.out.println("attackingStrategyId is null");
         * return false;
         * }
         * attackingStrategyId = split[0];
         */
        /*
         * ObjectMapper mapper = new ObjectMapper();
         * try {
         * attackingStrategyId = mapper.readValue(split[0], UUID.class);
         * } catch (JsonProcessingException e) {
         * e.printStackTrace();
         * System.out.println("JSON parsing of attackingStrategyId failed: " +
         * split[0]);
         * return false;
         * }
         */

        /*
         * if (split[1] == null) {
         * System.out.println("attackingSourceCode is null");
         * return false;
         * }
         * attackingStrategySource = split[1];
         * if (split[2] == null) {
         * System.out.println("defendingStrategyId is null");
         * return false;
         * }
         * defendingStrategyId = split[2];
         */
        /*
         * try {
         * defendingStrategyId = mapper.readValue(split[2], UUID.class);
         * } catch (JsonProcessingException e) {
         * e.printStackTrace();
         * System.out.println("JSON parsing of defendingStrategyId failed: " +
         * split[2]);
         * return false;
         * }
         */

        /*
         * if (split[3] == null) {
         * System.out.println("defendingSourceCode is null");
         * return false;
         * }
         * defendingStrategySource = split[3];
         * try {
         * numGames = Integer.parseInt(split[4]);
         * } catch (Exception e) {
         * e.printStackTrace();
         * System.out.printf("parsing of numGames from \"%s\" failed\n", split[2]);
         * return false;
         * }
         */

        return sentBattle;
    }

    // prepares for a battle and runs it if sentBattle is valid
    static void prepareAndRunBattle(Battle sentBattle) {
        if (sentBattle != null) {
            // extracts values

            try {
                if (sentBattle.attackingStrategy != null) {
                    attackerStockOverride = sentBattle.attackingStrategy.sourceCode == null;

                    if (sentBattle.attackingStrategy.sourceCode != null)
                        attackingSandbox = evaluateSourceCode(sentBattle.attackingStrategy.sourceCode);
                }
                if (sentBattle.defendingStrategy != null) {
                    defenderStockOverride = sentBattle.defendingStrategy.sourceCode == null;

                    if (sentBattle.defendingStrategy.sourceCode != null)
                        defendingSandbox = evaluateSourceCode(sentBattle.defendingStrategy.sourceCode);
                } else if (JAVASCRIPT_STOCK) {
                    attackingSandbox = evaluateSourceCode(getRandomAIJS());
                    defendingSandbox = evaluateSourceCode(getRandomAIJS());
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("JS EVALUATION ERROR - passed SourceCode has errors");
                return;
            }

            numGames = sentBattle.getIterations();

            if (numGames % 2 == 1) {
                // runs battle if message was properly parsed
                runBattle(sentBattle);
            } else {
                System.out.println("numGames must be odd, not: " + numGames);
            }
        }
    }

    // runs a full battle
    static void runBattle(Battle sentBattle) {
        // ask for console setup info
        // scan = new Scanner(System.in);
        /*
         * System.out.println("\nDo you want to run in CONSOLE mode? (y, n)\n" +
         * "This mode prints out important information and prompts for input.\n" +
         * "This mode is the only way to play manually.");
         * CONSOLE_APP = false;//scan.nextLine().equals("y");
         * if (CONSOLE_APP) {
         * System.out.println("Do you want the ATTACKER to be MANUAL? (y, n)");
         * ATTACKER_MANUAL = scan.nextLine().equals("y");
         * System.out.println("ATTACKER set to " + (ATTACKER_MANUAL ? "MANUAL" : "AI"));
         * System.out.println("Do you want the DEFENDER to be MANUAL? (y, n)");
         * DEFENDER_MANUAL = scan.nextLine().equals("y");
         * System.out.println("DEFENDER set to " + (DEFENDER_MANUAL ? "MANUAL" : "AI"));
         * }
         */
        setupStrategies();

        /*
         * System.out.println("\nDo you want to run in DEBUG mode? (y, n)\n" +
         * "This mode prints out more detailed status and error information.");
         * DEBUG = true;//scan.nextLine().equals("y");
         * int numGames;
         * while (true) {
         * System.out.
         * println("How many Games do you want in this Battle?  This must be an odd integer"
         * );
         * try {
         * numGames = Integer.parseInt(scan.nextLine());
         * if (numGames % 2 == 1)
         * break;
         * } catch (Exception e) { }
         * }
         */

        // setup Battle
        Battle battle = sentBattle;
        battle.init();

        while (numGames > 0) {
            // setup BattleGame
            BattleGame currentBattleGame = battle.addBattleGame();
            gameState = new GameState();

            Color gameWinner = playGame(battle, currentBattleGame);
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

            currentBattleGame.setWinner(gameWinner, jsonBoard, aPi, aPa, dPi, dPa);
            battle.processGameWinner(currentBattleGame, gameWinner);

            if (CONSOLE_APP)
                System.out.println("Game Over ---- Launching next game...");

            numGames--;
        }
        int aWins = battle.getAttackerWins();
        int dWins = battle.getDefenderWins();
        System.out.printf("%s wins the Battle!  A-%d vs D-%d\n", aWins > dWins ? "ATTACKER" : "DEFENDER", aWins, dWins);
        battle.complete();

        debugPrintln(battle.toString());

        // sends the resulting battle to the backend if there is RabbitMQ connection
        // allowed
        if (!NO_COMMUNICATION) {
            // sends message back to backend
            sendRabbitMQMessage(new SimulationResponse(battle, battle.getClientId()), RESP_QUEUE_NAME);
        }

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
            Color potentialWinner = playTurn(false, battle, battleGame);
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
    static Color playTurn(boolean isManualCom, Battle battle, BattleGame battleGame) {
        // fetch player move
        if (CONSOLE_APP)
            System.out.println(playerString(gameState.currentPlayer) + "'s turn");

        // for manualCom play, the player is the attacker
        boolean isAttackerTurn = isManualCom ? false : currentColor().equals(battleGame.getAttackerColor());

        String moveString = isAttackerTurn
                ? getAttackerMoveString(isManualCom)
                : getDefenderMoveString(isManualCom);
        lastMoveString = moveString;

        if (!isManualCom) {
            // stores moveString in new turn, even if invalid
            battleGame.addTurn(battle.getId(), currentColor(), moveString);
        }

        // validates move string
        boolean isValid = isMoveValid(moveString, gameState.board);
        if (!isValid) {
            if (DEBUG) {
                System.out.printf("INVALID MOVE from %s: %s\n", playerString(gameState.currentPlayer), moveString);
                System.out.println("Move String must be in the form \"<fromCell>, \"<toCell>\"");
            }
            return getPlayerColor(gameState.getOpponent());
        }

        // process player move
        processMove(moveString);

        if (CONSOLE_APP || DEBUG)
            printBoard();

        // determines if game has been won
        Color potentialWinner = checkIfGameWon();
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
    static String getAttackerMoveString(boolean isManualCom) {
        debugPrintln("Fetching attacker's move");
        if (ATTACKER_MANUAL)
            return scan.nextLine();

        // ATTACKER set to AI mode
        String moveString = "";
        try {
            // ATTACKER is a stock AI
            if (isManualCom || attackerStockOverride || (NO_COMMUNICATION && !JAVASCRIPT_STOCK)) {
                moveString = stockAttacker.getMove(gameState);// return processStrategySource(attackingEngine);
            } else // ATTACKER is sent from backend
                moveString = processStrategySource(attackingSandbox);// attackingStrategy.getMove(gameState);
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
    // isManualCom is whether or not this moveString is being acquired from a manual
    // test play window
    static String getDefenderMoveString(boolean isManualCom) {
        debugPrintln("Fetching defender's move");
        if (DEFENDER_MANUAL)
            return scan.nextLine();

        // DEFENDER set to AI mode
        String moveString = "";
        try {
            // DEFENDER is a stock AI
            if (isManualCom || defenderStockOverride || (NO_COMMUNICATION && !JAVASCRIPT_STOCK)) {
                moveString = stockDefender.getMove(gameState);// return processStrategySource(defendingEngine);
            } else // DEFENDER is sent from backend
                moveString = processStrategySource(defendingSandbox);// defendingStrategy.getMove(gameState);
        } catch (Exception e) {
            debugPrintf("Defender Exception\n%s\n", e);
            if (DEBUG)
                e.printStackTrace();
        }

        return moveString;
    }

    // evaluates source code for later fast running
    static /*ScriptEngine*/ NashornSandbox evaluateSourceCode(String strategySource) throws ScriptException {
        // sets up evaluator
        //ScriptEngineManager factory = new ScriptEngineManager();
        //ScriptEngine engine = factory.getEngineByName("nashorn");
        NashornSandbox sandbox = NashornSandboxes.create();

        // evaluates the script
        //engine.eval(strategySource);
        sandbox.eval(strategySource);

        // perform test processing
        if (gameState == null)
            gameState = new GameState();
        String testProcessingResult = processStrategySource(sandbox);
        boolean erroredOut = testProcessingResult == null;

        // inject line tracking code
        if (!erroredOut) {
            System.out.println("input: " + strategySource);
            strategySource = injectLineTrackingCode(strategySource);
            System.out.println("\n\n\n\noutput: " + strategySource);
            try {
                sandbox.eval(strategySource);
                processStrategySource(sandbox);
                String executionTrace = sandbox.getSandboxedInvocable().invokeFunction(EXECUTION_TRACKER_FUNC_NAME).toString();
                System.out.println("\nExecutedLines: " + executionTrace);
                String rawExecutionTrace = executionTrace;
                long lastTime = System.currentTimeMillis();
                System.out.println(0);
                executionTrace = compressExecutionTraceCycles(executionTrace);
                long curTime = System.currentTimeMillis();
                System.out.println((curTime - lastTime));
                lastTime = curTime;
                executionTrace = compressExecutionTraceConsecutive(executionTrace);
                curTime = System.currentTimeMillis();
                System.out.println((curTime - lastTime));
                lastTime = curTime;
                getMinimalExecutionTrace(rawExecutionTrace);
                curTime = System.currentTimeMillis();
                System.out.println((curTime - lastTime));
                lastTime = curTime;
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            }
        }

        return sandbox;
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
        int lineOfGetMove = 1;
        int indexOfGetMove = workingString.indexOf("getMove()");
        String lineCountingString = workingString.substring(0, indexOfGetMove);
        int currentLineNum = 1; // starts at 1 because this is how line numbering is
        int newLineIndex;
        while ((newLineIndex = lineCountingString.indexOf("\n")) >= 0) {
            // counts the read newline character to determine what line getMove() starts on
            lineOfGetMove++;

            if (newLineIndex >= lineCountingString.length())
                break;

            lineCountingString = lineCountingString.substring(newLineIndex + 1);
        }

        // starts the line counting with the calling of getMove()
        result += workingString.substring(0, indexOfGetMove);
        workingString = workingString.substring(indexOfGetMove);
        currentLineNum = lineOfGetMove;

        // defines patterns to match intermediate strings against
        String endingString = ".*";
        Pattern hasAnotherLinePattern = Pattern.compile(".*[^ }\\n\\t]+" + endingString, Pattern.DOTALL);
        String structureDetectionString = "\\A[ \\t]*(if|for|switch|while)[ \\t\\n]*\\([^\\n]*\\)";
        Pattern hasStructurePattern = Pattern.compile(structureDetectionString + endingString, Pattern.DOTALL);
        Pattern hasCommentedBraceAfterStructurePattern = Pattern.compile(structureDetectionString + "[ \\t]*//[^\\n]*\\{" + endingString, Pattern.DOTALL);
        Pattern hasClosedStructureDiffLineNoCommentPattern = Pattern.compile(structureDetectionString + "[ \\t\\n]*\\n*[ \\t\\n]*\\{" + endingString, Pattern.DOTALL);
        Pattern hasClosedStructureInSameLinePattern = Pattern.compile(structureDetectionString + "[^\\n]*\\{" + endingString, Pattern.DOTALL);
        Pattern hasReturnStatement = Pattern.compile(("\\A[ \\t]*return[ \\t][^\\n]+;.*"), Pattern.DOTALL);

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
            //if (hasStructure)
            //    System.out.println("struc: " + prevWorkingString.substring(structureMatcher.start(), structureMatcher.end()));
            boolean hasCommentedBraceAfterStructure = hasStructure && hasCommentedBraceAfterStructurePattern.matcher(prevWorkingString).matches();
            boolean hasClosedStructureInSameLine = hasStructure && hasClosedStructureInSameLinePattern.matcher(prevWorkingString).matches();
            boolean hasClosedStructureDiffLineNoComment = hasStructure && hasClosedStructureDiffLineNoCommentPattern.matcher(prevWorkingString).matches();
            cannotInjectLine = hasStructure && ((hasClosedStructureInSameLine && hasCommentedBraceAfterStructure) || !(hasClosedStructureDiffLineNoComment || hasClosedStructureInSameLine));

            String closingBrace = "";

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
                System.out.println(newCurrentLineString);
                currentLine = newCurrentLineString;
                shouldCloseAfterNextLine = true;
            }
            // injects the line, if possible
            String codeToInject = String.format("\t\t\t%s += \"%d, \";\n", EXECUTION_TRACKER_VAR_NAME, currentLineNum);

            // this "flag" can be toggled to enable injection of execution tracking code in the first line within a structure
            final boolean shouldTrackStructuresWhenExecutingWithin = false;

            if (hasStructure && !shouldTrackStructuresWhenExecutingWithin/*cannotInjectLine*/)
                result += currentLine;
            else if (hasReturnStatement.matcher(prevWorkingString).matches())
                result += codeToInject + currentLine;
            else // injects code after current line
                result += currentLine + codeToInject;

            result += closingBrace;

            // tracks the current line number so the proper execution tracking line can be injected
            currentLineNum++;

            // test printing
            Matcher matcher = hasAnotherLinePattern.matcher(workingString);
            hasAnotherLine = matcher.matches();
            System.out.println(String.format("\nmatchTest: %s hasAnotherLine? %b    hasStruc? %b    hasStrucComment? %b    hasCloseSameLine? %b    hasCloseDiffLine? %b",
                    prevWorkingString, hasAnotherLine, hasStructure, hasCommentedBraceAfterStructure, hasClosedStructureInSameLine, hasClosedStructureDiffLineNoComment));
                    //"\nmatchTest: " + prevWorkingString + " matches? " + hasAnotherLine + /*"\ncurrentLine:" + currentLine +*/ " hasUnclosedStructure? " + cannotInjectLine);
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

        // populates lineStringsToCheck
        for (int i = 0; i < lineStringSplit.length; i++) {
            String curLineString = lineStringSplit[i];
            int curLineNum = Integer.parseInt(curLineString);

            int lineStringIndex = getlineStringIndexInLineStringsList(curLineString, lineStringsToCheck);
            if (lineStringIndex < 0) {
                lineStringsToCheck.add(new ArrayList<>());
                lineStringIndex = lineStringsToCheck.size() - 1;
                lineStringsToCheck.get(lineStringIndex).add(curLineString);
            }

            lineStringsToCheck.get(lineStringIndex).add(i + "");
        }

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
                    for (int k = leftIndex + spacing; k < lineStringSplit.length; k += spacing) {
                        boolean foundCycle = doesWindowHoldExpectedCycle(lineStringSplit, leftIndex, k, spacing);
                        //System.out.printf("doesWindowHold(left: %d, right: %d, spacing: %d    -    %s\n", leftIndex, k, spacing, foundCycle + "");

                        if (!foundCycle)
                            break;

                        numCycleRepititions++;
                    }

                    if (numCycleRepititions > 1) {
                        /*String cycleInfoString = "(";

                        for (int k = 0; k < spacing; k++)
                            cycleInfoString += lineStringSplit[leftIndex + k] + ", ";

                        cycleInfoString += ")x" + numCycleRepititions + " -- indeces[" + leftIndex + "-" + (leftIndex + spacing - 1) + "]";*/
                        CycleInfo newCycleInfo = new CycleInfo(lineStringSplit, numCycleRepititions, leftIndex, spacing);
                        //System.out.println(cycleInfoString + "     " + newCycleInfo.getCompressedCycleString());
                        cycleInfoHeap.add(newCycleInfo);

                        leftIndex = newCycleInfo.lastCycleEndIndex + 1;
                        //System.out.println("newLeftIndex: " + leftIndex);
                    }
                    else
                        leftIndex += spacing;

                    //System.out.println("newLeftIndex: " + leftIndex);
                }
            }
        }

        String[] cycledStringArray = lineStringSplit.clone();
        // replaces lineStrings in the array with the
        ArrayList<CycleInfo> usedCycleInfos = new ArrayList<>();
        while (!cycleInfoHeap.isEmpty()) {
            CycleInfo curInfo = cycleInfoHeap.remove();
            String curLineString = cycledStringArray[curInfo.firstCycleStartIndex];
            //System.out.println("examined cycleCompressed " + curInfo.firstCycleStartIndex + ":" + curInfo.lastCycleEndIndex);

            // continue if already compressed into another index
            if (curLineString.equals(""))
                continue;

            // coninue if this index holds compressed info
            if (curLineString.contains("("))
                continue;
            int curLineNum;
            try {
                curLineNum = Integer.parseInt(curLineString);
            } catch (Exception e) {
                continue;
            }

            // continue if compressing at least 2 iterations would attempt to compress already compressed info
            boolean containsCompressedInfo = false;
            for (int i = curInfo.firstCycleStartIndex; i <= curInfo.lastCycleEndIndex; i++) {
                if (cycledStringArray[i].equals("") || cycledStringArray[i].contains("(")) {
                    containsCompressedInfo = true;
                    break;
                }
            }
            if (containsCompressedInfo)
                continue;;

            //System.out.println("using cycleCompressed " + curInfo.firstCycleStartIndex + ":" + curInfo.lastCycleEndIndex);

            cycledStringArray[curInfo.firstCycleStartIndex] = curInfo.getCompressedCycleString();
            //System.out.println(curInfo.getNumCompressedLineNumsBeforeIndex(curInfo.lastCycleEndIndex));

            for (int i = curInfo.firstCycleStartIndex + 1; i <= curInfo.lastCycleEndIndex; i++) {
                cycledStringArray[i] = "";
            }

            usedCycleInfos.add(curInfo);
        }

        // prints out the compressed cycle strings
        //System.out.print("CompressedCycles: ");
        for (int i = 0; i < cycledStringArray.length; i++) {
            String curString = cycledStringArray[i];

            if (curString.equals(""))
                continue;

            //System.out.print(curString + ", ");
            //result += curString + ", ";
            builderResult.append(curString + ", ");
        }
        //System.out.println("");

        result = builderResult.toString();
        System.out.println("CompressedCycles: " + result);
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
            int nextCommaIndex = workingString.indexOf(", ");
            if (nextCommaIndex < 0)
                break;

            String curLineString = workingString.substring(0, nextCommaIndex);
            workingString = workingString.length() > nextCommaIndex + 1 ? workingString.substring(nextCommaIndex + 2) : "";

            int curLineNum;
            try {
                curLineNum = Integer.parseInt(curLineString);
            } catch (Exception e) {
                /*if (prevLineNum >= 0)
                    result += prevLineNum + ",A ";*/
                /*result += curLineString + ",a ";
                prevLineNum = -5;
                continue;*/
                curLineNum = -5;
            }

            if (chainStartLineNum >= 0 && (curLineNum != prevLineNum + 1 || workingString.length() <= 0)) {
                if (prevLineNum - chainStartLineNum > 1)
                    builderResult.append("[" + chainStartLineNum + "-" + prevLineNum + "], ");// + curLineString + ", ");
                else {
                    builderResult.append(chainStartLineNum + ", ");

                    if (prevLineNum >= 0)
                        builderResult.append(prevLineNum + ", ");
                }
                chainStartLineNum = -5;
            }
            else if (prevLineNum >= 0 && (curLineNum != prevLineNum + 1 || workingString.length() <= 0)) {
                builderResult.append(prevLineNum + ", ");
            }
            else if (curLineNum == prevLineNum + 1) {
                if (chainStartLineNum < 0)
                    chainStartLineNum = prevLineNum;
            }

            if (workingString.length() <= 0) {
                builderResult.append(curLineString + ", ");
                break;
            }
            else if (curLineNum < 0)
                builderResult.append(curLineString + ", ");

            prevLineNum = curLineNum;
        }

        System.out.println("Compressed: " + result);

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
        Arrays.sort(splitArr);

        String prevLineString = "";
        for (int i = 0; i < splitArr.length; i++) {
            String curLineString = splitArr[i];
            if (curLineString.equals("") || curLineString.equals(" "))
                break;

            if (!curLineString.equals(prevLineString))
                builderResult.append(curLineString + ", ");//result += curLineString + ", ";

            prevLineString = curLineString;
        }

        result = builderResult.toString();
        System.out.println("Minimal: " + result);
        return result;
    }

    // gets a moveString from evaluating the strategy's source code
    static String processStrategySource(/*ScriptEngine strategyEngine*/ NashornSandbox strategySandbox) {
        String result;
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

            result = "" + inv.invokeFunction("getMove");

            try {
                execTrace = "" + inv.invokeFunction(EXECUTION_TRACKER_FUNC_NAME);
            } catch (NoSuchMethodException ex) {
                System.out.println("ERROR: " + EXECUTION_TRACKER_FUNC_NAME + "() not properly added to source");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result = "JS INVOKE ERROR";
        }

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
    public static Color checkIfGameWon() {
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

        return null;
    }

    // changes whose turn it is in the gameState
    public static void alternatePlayer() {
        gameState.currentPlayer = gameState.getOpponent();
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
                "    var board = gameState.board;\n" +
                "    var pieceLocations = getMyPieceLocations(getMyColor());\n" +
                "    var numMovesFound = 0;\n" +
                "    var moves = new Array(NUM_PIECES_PER_SIDE);\n" +
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
                "            numMovesFound++;\n" +
                "        }\n" +
                "    }\n" +
                "\n" +
                "    if (numMovesFound === 0) { //if you have no legal moves, that means you are checkmated\n" +
                "        return \"CHECKMATED\";\n" +
                "    }\n" +
                "    return moves[Math.floor((Math.random() * numMovesFound))];\n" +
                "}";

        return s;/*"//this is random text\n" +
                "//some more random text\n" +
                "function getMove() {\n" +
                //"var File = Java.type('java.io.File'); File;\n" +
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
                "    if (true)\n" +
                "       return \"A8, A7\";\n" +
                "    return \"A1, A2\";\n" +
                "}";*/
    }
}