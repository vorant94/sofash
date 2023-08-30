import { type ClientOptions, OpenAI } from 'openai';
import { type ChatCompletion } from 'openai/resources/chat/index';
import { EXTRACT_EVENT_DATA_PROMPT } from './event-data/extract-event-data.prompt.js';
import { type EventDataModel } from './event-data/event-data.model.js';
import { EVENT_DATA_SCHEMA } from './event-data/event-data.schema.js';
import { type Logger } from 'logger';

export class Llm {
  readonly #openai: OpenAI;
  readonly #logger: Logger;

  constructor(options: LlmOptions, logger: Logger) {
    this.#openai = new OpenAI(options);
    this.#logger = logger.clone(Llm.name);
  }

  async health(): Promise<string> {
    const completion = await this.#openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Say this is the test' }],
      model: 'gpt-3.5-turbo',
    });

    return this.#parseCompletionContent(completion);
  }

  async extractEventData(message: string): Promise<EventDataModel> {
    const completion = await this.#openai.chat.completions.create({
      messages: [
        { role: 'system', content: EXTRACT_EVENT_DATA_PROMPT },
        { role: 'user', content: message },
      ],
      model: 'gpt-3.5-turbo',
    });

    const content = this.#parseCompletionContent(completion);

    const { value, error } = EVENT_DATA_SCHEMA.validate(JSON.parse(content));
    if (error != null) {
      throw new Error(error.message);
    }

    return value;
  }

  #parseCompletionContent(completion: ChatCompletion): string {
    this.#logger.debug(
      `parseCompletionContent started: ${JSON.stringify(completion, null, 2)}`,
    );

    const content = completion.choices.at(0)?.message?.content;
    if (content == null) {
      throw new Error(`No content is found in completion`);
    }

    this.#logger.debug(`parseCompletionContent finished: ${content}`);
    return content;
  }
}

export type LlmOptions = Pick<ClientOptions, 'apiKey'>;
