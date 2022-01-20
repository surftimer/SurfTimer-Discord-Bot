FROM node:16.13.2-alpine3.15

WORKDIR /usr/src/app

RUN apk add --no-cache git
RUN git clone https://github.com/Sarrus1/SurfTimer-Discord-Bot.git .

RUN npm i && npm run tsc -b

CMD npm run start