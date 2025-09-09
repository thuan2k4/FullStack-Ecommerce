FROM node:20-slim
 
WORKDIR /usr/src/node

COPY package*.json ./

RUN npm install --silent

COPY . .

EXPOSE 4000

CMD ["npm", "run", "server"]