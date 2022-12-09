package Simulation;

import javax.script.Invocable;
import java.util.concurrent.Callable;

public class GetMoveCallable implements Callable {
    Invocable inv;

    public GetMoveCallable(Invocable inv) {
        this.inv = inv;
    }

    @Override
    public Object call() throws Exception {
        //System.out.println("GetMoveCallable.call()");
        return "" + inv.invokeFunction("getMove");
    }
}
