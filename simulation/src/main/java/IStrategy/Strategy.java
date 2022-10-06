package IStrategy;

import Simulation.Battle;

import java.util.ArrayList;
import java.util.UUID;

public class Strategy {
    public UUID id;
    public String name;
    public String sourceCode;
    public int status;
    // Draft = 0
    // Active = 1
    // InActive = -1
    public int version;

    public UUID createdByUserId;
    public User createdByUser;

    public int gameId;
    public Game game;

    public ArrayList<Battle> attackerBattles;
    public ArrayList<Battle> defenderBattles;
}
