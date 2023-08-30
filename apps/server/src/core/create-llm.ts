import { type Env } from './env.js';
import { Llm } from 'llm';
import { type Logger } from 'logger';

export function createLlm(env: Env, logger: Logger): Llm {
  const llm = new Llm({ apiKey: env.LLM_API_KEY }, logger);

  return llm;
}
