package Simulation;

import java.util.UUID;

public class Turn {
    private UUID battleId;
    private int battleGameNumber;
    private int turnNumber; // the first turn of a game has turnNumber=0
    private boolean isAttackerTurn;
    private String turnData; // Stores the moveString sent to the simulation service.
                     // A valid moveString follows the form, "<fromCell>, <toCell>",
                     // but whatever was sent is stored, even if invalid.

    public Turn(UUID battleId, int battleGameNumber, int turnNumber,
                boolean isAttackerTurn, String moveString) {
        this.battleId = battleId;
        this.battleGameNumber = battleGameNumber;
        this.turnNumber = turnNumber;
        this.isAttackerTurn = isAttackerTurn;
        turnData = moveString;
    }

    @Override
    public String toString() {
        return "Turn{" +
                "battleId=" + battleId +
                ", battleGameNumber=" + battleGameNumber +
                ", turnNumber=" + turnNumber +
                ", isAttackerTurn=" + isAttackerTurn +
                ", turnData='" + turnData + '\'' +
                '}';
    }
}
