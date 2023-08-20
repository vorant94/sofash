FROM node:18-bookworm as build

WORKDIR /usr/local/sofash
ENV YARN_VERSION 3.6.1
RUN yarn policies set-version $YARN_VERSION

COPY . .
RUN yarn workspaces focus server
RUN yarn workspace server build

RUN rm -rf node_modules
RUN yarn workspaces focus server --production
RUN yarn cache clean

FROM node:18-alpine as serve

WORKDIR /usr/local/sofash
ENV YARN_VERSION 3.6.1
RUN yarn policies set-version $YARN_VERSION

COPY --from=build /usr/local/sofash /usr/local/sofash

EXPOSE 3000
CMD ["yarn", "start"]
