# sofash

A Telegram Bot that aggregates interesting local events for your, so you always know where to go on weekend

### requirements

- install `NodeJS ^18.0.0` via Homebrew (`brew install node@18`)
- make sure corepack is enabled (run `corepack enable`)
- install `Docker Desktop` (with support for Compose V2)

### local dev setup

- run `yarn`
- run `yarn docker:up`
- make sure to go through [db](libs/db/README.md) lib README to properly setup project database
