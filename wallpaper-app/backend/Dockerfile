FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/wallpaper-app-1.0.0.jar app.jar

ENV PORT=8080
ENV UPLOAD_DIR=/app/uploads

EXPOSE 8080

RUN mkdir -p /app/uploads /app/data

CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
