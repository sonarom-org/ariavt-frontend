# syntax=docker/dockerfile:1

# Alpine: small distro
FROM node:16-alpine

WORKDIR /app_wd

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

CMD [ "npm", "start" ]
