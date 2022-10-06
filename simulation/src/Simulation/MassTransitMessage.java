package Simulation;

import java.util.UUID;

public class MassTransitMessage<T> {
    private String messageId;
    private String requestId;
    private String correlationId;
    private String conversationId;
    private String initiatorId;
    private String sourceAddress;
    private String destinationAddress;
    private String faultAddress;
    private String[] messageType;
    public T message;

    public MassTransitMessage () {

    }
    
    public MassTransitMessage (UUID messageId, UUID requestId, UUID correlationId,
                               UUID conversationId, UUID initiatorId, String sourceAddress,
                               String destinationAddress, String faultAddress, String[] messageType,
                               T message) {
        this.messageId = messageId.toString();
        this.requestId = requestId.toString();
        this.correlationId = correlationId.toString();
        this.conversationId = conversationId.toString();
        this.initiatorId = initiatorId.toString();
        this.sourceAddress = sourceAddress;
        this.destinationAddress = destinationAddress;
        this.faultAddress = faultAddress;
        this.messageType = messageType;
        this.message = message;
    }
}