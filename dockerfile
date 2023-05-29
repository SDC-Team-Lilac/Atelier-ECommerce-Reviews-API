FROM node:12

WORKDIR /app

NEW_RELIC_NO_CONFIG_FILE=true

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "server" ]