#
# Build stage
#
FROM maven:3.8.6-amazoncorretto-17 AS build
WORKDIR /app

# Copy everything from Maven project and build
COPY ./ ./
RUN mvn clean package

#
# Runtime stage
#
FROM amazoncorretto:17
WORKDIR /app
COPY --from=build /app/target/simulation-1.0.jar ./simulation.jar
ENTRYPOINT ["java","-jar","./simulation.jar"]