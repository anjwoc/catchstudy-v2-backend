FROM node:12-alpine

WORKDIR /app

ENV NODE_ENV production

COPY ./package.json ./

RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*

RUN apk add --no-cache --virtual .gyp python3 python make g++ \
    && npm install\
    && npm rebuild bcrypt --build-from-source\
    && apk del make gcc g++ python

COPY . .

ENV HOST=0.0.0.0
ENV PORT=4550
EXPOSE 4550

RUN npm run build

CMD ["npm",  "start"]