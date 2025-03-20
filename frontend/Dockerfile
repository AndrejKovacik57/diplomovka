FROM node:21.1.0-alpine

WORKDIR /app

COPY src ./src
COPY public ./public

COPY .env.local ./
COPY package.json package-lock.json ./
COPY tsconfig.json ./

RUN apk update

RUN npm install

CMD ["npm", "start"]