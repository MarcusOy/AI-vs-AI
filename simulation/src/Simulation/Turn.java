package Simulation;

// The info associated with one player's move
public class Turn {
    private String battleId;
    private int battleGameNumber;
    private int turnNumber; // the first turn of a game has turnNumber=0
    private boolean isAttackTurn;
    private String turnData; // Stores the moveString sent to the simulation service.
                     // A valid moveString follows the form, "<fromCell>, <toCell>",
                     // but whatever was sent is stored, even if invalid.

    public Turn(String battleId, int battleGameNumber, int turnNumber,
                boolean isAttackTurn, String moveString) {
        this.battleId = battleId;
        this.battleGameNumber = battleGameNumber;
        this.turnNumber = turnNumber;
        this.isAttackTurn = isAttackTurn;
        turnData = moveString;
    }

    @Override
    public String toString() {
        return "Turn{" +
                "battleId=" + battleId +
                ", battleGameNumber=" + battleGameNumber +
                ", turnNumber=" + turnNumber +
                ", isAttackerTurn=" + isAttackTurn +
                ", turnData='" + turnData + '\'' +
                '}';
    }
}
