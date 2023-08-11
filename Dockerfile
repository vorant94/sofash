FROM node:18-alpine
WORKDIR /usr/local/app

COPY package.json ./
COPY yarn.lock ./
COPY .yarn ./
RUN yarn

COPY . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
