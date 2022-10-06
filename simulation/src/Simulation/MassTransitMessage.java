package Simulation;

import java.util.UUID;

public class MassTransitMessage<T> {
    private UUID messageId;
    private UUID requestId;
    private UUID correlationId;
    private UUID conversationId;
    private UUID initiatorId;
    private String sourceAddress;
    private String destinationAddress;
    private String faultAddress;
    private String[] messageType;
    public T message;

    public MassTransitMessage (UUID messageId, UUID requestId, UUID correlationId,
                               UUID conversationId, UUID initiatorId, String sourceAddress,
                               String destinationAddress, String faultAddress, String[] messageType,
                               T message) {
        this.messageId = messageId;
        this.requestId = requestId;
        this.correlationId = correlationId;
        this.conversationId = conversationId;
        this.initiatorId = initiatorId;
        this.sourceAddress = sourceAddress;
        this.destinationAddress = destinationAddress;
        this.faultAddress = faultAddress;
        this.messageType = messageType;
        this.message = message;
    }
}