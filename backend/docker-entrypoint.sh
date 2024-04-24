#!/bin/bash

source /run/secrets/fc_24_env
export SPRING_DATASOURCE_PASSWORD JWT_SECRET
java -jar /app/app.jar