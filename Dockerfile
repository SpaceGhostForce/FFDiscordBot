FROM node:9.11.2-alpine

RUN mkdir -p /app
WORKDIR /app
COPY package-lock.json /app
COPY package.json /app

RUN /usr/local/bin/npm install --production

COPY . /app