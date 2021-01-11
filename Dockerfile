FROM node:14-alpine

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

RUN npm run build
COPY --from=0 /app/dist ./dist
ENV HOST=0.0.0.0
ENV PORT=4550
EXPOSE 4550

CMD ["npm",  "start"]