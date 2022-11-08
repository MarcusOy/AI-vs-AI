package Simulation;

import java.util.UUID;

public class MassTransitMessage<T> {
    public String messageId;
    public String requestId;
    public String correlationId;
    public String conversationId;
    public String initiatorId;
    public String sourceAddress;
    public String destinationAddress;
    public String responseAddress;
    public String faultAddress;
    public String[] messageType;
    public T message;
//    public String expirationTime;
//    public String sentTime;
//    public Object headers;
//    public



    public MassTransitMessage () {

    }
    
    public MassTransitMessage (String messageId, String requestId, String correlationId,
                               String conversationId, String initiatorId, String sourceAddress,
                               String destinationAddress, String responseAddress, String faultAddress,
                               String[] messageType, T message) {
        this.messageId = messageId;
        this.requestId = requestId;
        this.correlationId = correlationId;
        this.conversationId = conversationId;
        this.initiatorId = initiatorId;
        this.sourceAddress = sourceAddress;
        this.destinationAddress = destinationAddress;
        this.responseAddress = responseAddress;
        this.faultAddress = faultAddress;
        this.messageType = messageType;
        this.message = message;
    }
}