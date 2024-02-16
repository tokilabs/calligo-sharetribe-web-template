FROM node:lts-alpine as build
RUN apk update && apk add git
RUN apk add openssh-client

WORKDIR /usr/src/app

COPY "package.json" ./
COPY "yarn.lock*" ./
COPY "package-lock.json*" ./
COPY "npm-shrinkwrap.json*" ./

RUN yarn install --production

COPY . .

RUN chown -R node /usr/src/app
RUN chmod +x ./scripts/*.sh

RUN ./scripts/clone-site.sh
RUN ./scripts/build-site.sh

RUN yarn run build

FROM node:lts-alpine as release

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/package-lock.json* ./
COPY --from=build /usr/src/app/npm-shrinkwrap.json* ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

RUN chown -R node /usr/src/app
USER node
CMD ["yarn", "start"]
