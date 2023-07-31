import { Command } from 'commander';
import { createCreateCommand } from './create.command.js';
import { createCreateUserCommand } from './create-user.command.js';
import { createDropCommand } from './drop.command.js';
import { createDropUserCommand } from './drop-user.command.js';
import type pg from 'pg';
import { type Env } from '../core/env.js';

export function createDbCommand(pgClient: pg.Client, env: Env): Command {
  return new Command('db')
    .addCommand(createCreateCommand(pgClient))
    .addCommand(createCreateUserCommand(pgClient))
    .addCommand(createDropCommand(env, pgClient))
    .addCommand(createDropUserCommand(env, pgClient));
}
