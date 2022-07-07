FROM node:alpine

WORKDIR usr/src/app

COPY package* ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
