import { CONTAINER, DB, ENV, LOGGER, TELEGRAF } from '../shared/container.js';
import { type Telegraf } from 'telegraf';
import { createTelegrafWebhookUrl } from '../shared/create-telegraf-webhook-url.js';
import { type Db } from 'db';
import { type Logger } from 'logger';
import { type Env } from '../core/env.js';
import { type AsyncRequestHandler } from '../shared/handle-async-request.js';
import { type Request, type Response } from 'express';

export const handleHealthRequest: AsyncRequestHandler = async (
  _: Request,
  res: Response<HealthResponse>,
): Promise<void> => {
  const env = CONTAINER.get<Env>(ENV);
  const telegraf = CONTAINER.get<Telegraf>(TELEGRAF);
  const db = CONTAINER.get<Db>(DB);
  const logger = CONTAINER.get<Logger>(LOGGER);

  logger.info('server is checking health');

  const [telegrafRes, dbRes] = await Promise.allSettled([
    telegraf.telegram.getWebhookInfo(),
    db.health(),
  ]);

  res.json({
    timestamp: new Date().toISOString(),
    server: 'ok',
    db: dbRes.status === 'fulfilled' ? 'ok' : dbRes.reason,
    telegraf: parseTelegrafRes(env, telegrafRes),
  });
};

export interface HealthResponse {
  timestamp: string;
  server: HealthStatus;
  db: HealthStatus;
  telegraf: HealthStatus;
}

export type HealthStatus = 'ok' | string;

function parseTelegrafRes(
  env: Env,
  telegrafRes: PromiseSettledResult<WebhookInfo>,
): string {
  if (telegrafRes.status !== 'fulfilled') {
    return telegrafRes.reason;
  }
  const expected = createTelegrafWebhookUrl(env).toString();
  const actual = telegrafRes.value.url ?? '';
  if (actual !== expected) {
    return `the webhooks don't match: ${actual} !== ${expected}`;
  }

  return 'ok';
}

type WebhookInfo = Awaited<ReturnType<Telegraf['telegram']['getWebhookInfo']>>;
