# sofash

A Telegram Bot that aggregates interesting local events for your, so you always know where to go on weekend

### local dev setup

- run `yarn install`
- run `yarn run docker:up`
- run `yarn docker:pg` to ssh to your db
- run `create database sofash;` to create a database and exit the container
- make sure to go through `db` lib `README.md` to properly setup project database
