package Strategy;

import javax.script.*;
public class EvalMoveString {
    public static void main(String[] args) throws Exception {
        if (args.length < 1) {
            System.err.println("Usage: java EvalMoveString.java moveString");
            System.exit(1);
        }

        // create a script engine manager
        ScriptEngineManager factory = new ScriptEngineManager();
        // create a JavaScript engine
        ScriptEngine engine = factory.getEngineByName("JavaScript");
        // evaluate JavaScript code from String

        //engine.eval("print('Hello, World')");
        System.out.println(engine.eval(args[0]));
        //the result of the last expression is the return value of eval
    }
}