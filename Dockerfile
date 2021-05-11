FROM node:14

WORKDIR /app

COPY . .

WORKDIR /app/server

CMD ["yarn", "start"]