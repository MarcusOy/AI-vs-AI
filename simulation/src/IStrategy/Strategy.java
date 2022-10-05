package IStrategy;

import Simulation.Battle;

import java.util.ArrayList;
import java.util.UUID;

public class Strategy {
    public UUID Id;
    public String Name;
    public String SourceCode;
    public StrategyStatus Status;
    public int Version;

    public UUID CreatedByUserId;
    public User CreatedByUser;

    public int GameId;
    public Game game;

    public ArrayList<Battle> AttackerBattles;
    public ArrayList<Battle> DefenderBattles;
}
