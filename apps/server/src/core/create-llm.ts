import { type Env } from './env.js';
import { Llm } from 'llm';

export function createLlm(env: Env): Llm {
  const llm = new Llm({
    apiKey: env.LLM_API_KEY,
  });

  return llm;
}
