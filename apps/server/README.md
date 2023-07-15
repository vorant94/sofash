# server

### requirements

- run `yarn workspace env run build` to build env lib in case it is not built yet

### local dev setup

- create `.env` file in the server app dir and specify your working env (e.g. `NODE_ENV=DEV`)
- go to [BotFather](https://t.me/BotFather), create there your dev bot, retrieve its token
- add bot token from above into `.env` file (e.g. `TG_BOT_TOKEN=<your-token-goes-here>`)
- run `yarn run lt` to host your machine to the internet, retrieve your public url
- add public url from above to `.env` file (e.g. `TG_BOT_WEBHOOK_URL=<your-public-url-goes-here>`)
- run `yarn run dev:watch` and send any message to the bot, you should receive `Hello` in response
