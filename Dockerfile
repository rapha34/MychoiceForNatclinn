FROM maven:3.9.11-eclipse-temurin-17 AS build

WORKDIR /app

COPY mychoice-backend ./mychoice-backend
COPY mychoice-frontend ./mychoice-frontend

WORKDIR /app/mychoice-backend
RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:17-jre

WORKDIR /opt/mychoice
COPY --from=build /app/mychoice-backend/target/MyChoice.war ./MyChoice.war

EXPOSE 9090
CMD ["java", "-jar", "MyChoice.war", "--server.port=9090"]
