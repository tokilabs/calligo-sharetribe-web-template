FROM node:16-alpine AS build

WORKDIR /home/node/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production

COPY . .
RUN yarn run build

FROM node:16-alpine AS release
WORKDIR /home/node/app
COPY --from=build /home/node/app/package.json ./
COPY --from=build /home/node/app/yarn.lock ./
COPY --from=build /home/node/app/node_modules ./node_modules
COPY --from=build /home/node/app/build ./build

ENV PORT=4000
ENV NODE_ENV=production
EXPOSE 4000

USER node
CMD ["yarn", "start"]
