FROM node:16-alpine3.16

WORKDIR /usr/server
COPY ./app ./app
COPY ./package.json ./package.json

RUN apk update && \
    npm i --production --silent

ARG PORT
ENV PORT=$PORT

EXPOSE $PORT
CMD [ "npm", "--", "start" ]
