FROM node:14

WORKDIR /app

COPY . .

WORKDIR /app/client

RUN yarn install

RUN yarn build

WORKDIR /app/server

RUN yarn install

CMD ["yarn", "start"]
