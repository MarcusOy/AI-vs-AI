package Simulation;

import IStrategy.EasyAI;
import IStrategy.RandomAI;
import IStrategy.IStrategy;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;

import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

public class SimTestProducer {

    public SimTestProducer() {

    }

    public void createConnection(int numGames) throws URISyntaxException, NoSuchAlgorithmException, KeyManagementException {
        ConnectionFactory factory = new ConnectionFactory();
        /*factory.setHost(SimulationApp.HOST);
        factory.setPort(SimulationApp.PORT);*/
        SimulationApp.setupConnection(factory);
        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            channel.queueDeclare(SimulationApp.QUEUE_NAME, false, false, false, null);

            IStrategy attackingStrategy = new RandomAI();
            IStrategy defendingStrategy = new EasyAI();
            String attackingStrategySource;
            String defendingStrategySource;

            ObjectMapper mapper = new ObjectMapper();
            mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            //try {
            attackingStrategySource = "function getMove() { return 'A8, A7' }";//mapper.writeValueAsString(attackingStrategy);
            defendingStrategySource = "function getMove() { return 'A1, A2' }";/*mapper.writeValueAsString(defendingStrategy);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                System.out.println("JSON writing of strategies failed");
                return;
            }*/


            String delimiter = SimulationApp.MESSAGE_DELIMITER;
            String message = UUID.randomUUID() + delimiter + attackingStrategySource + delimiter + UUID.randomUUID() + delimiter + defendingStrategySource + delimiter + numGames;
            channel.basicPublish("", SimulationApp.QUEUE_NAME, null, message.getBytes());
            System.out.println(" [x] Sent '" + message + "'");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}