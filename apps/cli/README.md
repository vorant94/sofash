# cli

### requirements

[//]: # (TODO: add tdlib to docker compose instead)
- install `TDLib 1.8.0` via Homebrew (`brew install tdlib`)
- run `yarn build` to build all the libs, that are required for this app

### local dev setup

- create `.env` file in the cli app dir
- specify your working env (e.g. `NODE_ENV=DEV`) and other env vars, see [env.mixin.ts](./src/shared/env.mixin.ts) for reference
  - `TG_CLIENT_API_ID` and `TG_CLIENT_API_HASH` you can get by going to [API development tools](https://my.telegram.org/apps) and creating there your dev app
- run `yarn dev telegram login` to login with your Telegram account
- run `yarn dev telegram get-chat-history`, you should receive last messages from a target chat
