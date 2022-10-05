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
            String attackingStrategyJSON;
            String defendingingStrategyJSON;

            ObjectMapper mapper = new ObjectMapper();
            mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            //try {
            attackingStrategyJSON = "attack";//mapper.writeValueAsString(attackingStrategy);
            defendingingStrategyJSON = "defend";/*mapper.writeValueAsString(defendingStrategy);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                System.out.println("JSON writing of strategies failed");
                return;
            }*/

            String message = attackingStrategyJSON + ", " + defendingingStrategyJSON + ", " + numGames;
            channel.basicPublish("", SimulationApp.QUEUE_NAME, null, message.getBytes());
            System.out.println(" [x] Sent '" + message + "'");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}