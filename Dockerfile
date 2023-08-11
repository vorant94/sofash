FROM node:18-alpine
WORKDIR /usr/local/app
ENV YARN_VERSION 3.6.1
RUN yarn policies set-version $YARN_VERSION

COPY package.json yarn.lock ./
COPY .yarn ./.yarn
RUN yarn

COPY . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
