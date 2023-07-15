# cli

### requirements

- install `TDLib 1.8.0` via Homebrew (`brew install tdlib`)
- run `yarn workspace env run build` to build env lib in case it is not built yet

### local dev setup

- create `.env` file in the cli app dir and specify your working env (e.g. `NODE_ENV=DEV`)
- go to [API development tools](https://my.telegram.org/apps), create there your dev app, retrieve its api id and api hash
- add api id and api hash from above into `.env` file (e.g. `TG_CLIENT_API_ID=<your-client-api-id>` and `TG_CLIENT_API_HASH=<your-client-api-hash>`)
- run `yarn dev telegram login` to login with your Telegram account
- run `yarn run dev telegram get-chat-history`, you should receive last messages from a target chat
