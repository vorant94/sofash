import { type ClientOptions, OpenAI } from 'openai';

export class Llm {
  readonly #openai: OpenAI;

  constructor(options: LlmOptions) {
    this.#openai = new OpenAI(options);
  }

  async health(): Promise<any> {
    return await this.#openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Say this is the test' }],
      model: 'gpt-3.5-turbo',
    });
  }
}

export type LlmOptions = Pick<ClientOptions, 'apiKey'>;
