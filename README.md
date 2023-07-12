# sofash

A Telegram Bot that aggregates interesting local events for your, so you always know where to go on weekend

# local dev setup

- run `yarn install` and go to server app `cd apps/server`
- create `.env` file in the server app dir and specify your working env (e.g. `NODE_ENV=DEV`)
- go to [BotFather](https://t.me/BotFather), create there your dev bot, retrieve its token
- add bot token from above into `.env` file (e.g. `TG_BOT_TOKEN=<your-token-goes-here>`)
- run `yarn run lt` to host your machine to the internet, retrieve your public url
- add public url from above to `.env` file (e.g. `TG_BOT_WEBHOOK_URL=<your-public-url-goes-here>`)
- run `yarn run start:dev:watch` and send any message to the bot, you should receive `Hello` in response
