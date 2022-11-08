package IStrategy;

import API.Java.API;
import Simulation.GameState;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.*;

public class TestJavascriptStrategy implements IStrategy {
    /**
     * API containing helper functions
     */
    private API api;

    public TestJavascriptStrategy() {
        api = new API();
    }

    @Override
    public String getMove(GameState gameState) {
        // create a script engine manager
        ScriptEngineManager factory = new ScriptEngineManager();
        // create a JavaScript engine
        ScriptEngine engine = factory.getEngineByName("JavaScript");
        // evaluate JavaScript code from String

        engine.put("gameState", gameState);

        try {
            String script = "function constantMove() { return 'A1, A2' }";
            engine.eval(script);

            Invocable inv = (Invocable) engine;
            return "" + inv.invokeFunction("constantMove");
        } catch (Exception e) {
            return null;
        }
    }
}
