FROM node:18.12-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache git

# Prevent git clone caching
ADD https://api.github.com/repos/Sarrus1/SurfTimer-Discord-Bot/git/refs/heads/main version.json
RUN rm -r *
RUN git clone https://github.com/Sarrus1/SurfTimer-Discord-Bot.git .

RUN npm i && npm run build

CMD npm run start