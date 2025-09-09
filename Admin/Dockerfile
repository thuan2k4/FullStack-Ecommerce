FROM node:20-slim

WORKDIR /usr/src/app-admin

COPY package*.json ./

RUN npm install --silent

COPY . .

EXPOSE 5174

CMD ["npm", "run", "dev"]