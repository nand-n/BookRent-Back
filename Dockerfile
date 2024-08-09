FROM node:20 as development

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

# RUN yarn build

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]

FROM node:20 as production

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]