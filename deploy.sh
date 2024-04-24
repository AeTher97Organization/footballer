#!/bin/bash

npm install yarn
cd frontend || exit
yarn install
yarn run build
cd ..
cp -r frontend/build/. backend/src/main/resources/static

cd backend
#docker build -t footballer:latest .
