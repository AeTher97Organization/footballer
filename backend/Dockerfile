FROM eclipse-temurin:8-jdk

WORKDIR /app
COPY  target/footballer-2.0.0.jar ./app.jar
COPY  docker-entrypoint.sh /
RUN chmod 755 /docker-entrypoint.sh

LABEL maintainer="michael93509@gmail.com"

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
