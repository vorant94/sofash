import { type Parser } from './parser.js';
import { type TelegramRawEventJob } from 'mq';
import { type EventEntity } from 'db';
import { type Logger } from 'logger';
import {
  type message,
  type MessageContent,
  type messagePhoto,
  type messageText,
} from 'tdlib-types';
import { type Llm } from 'llm';
import { type DeepPartial } from 'typeorm';

export class TelegramParser implements Parser<TelegramRawEventJob> {
  readonly #logger: Logger;
  readonly #llm: Llm;

  constructor(logger: Logger, llm: Llm) {
    this.#logger = logger.clone(TelegramParser.name);
    this.#llm = llm;
  }

  async parseRawEventJob(
    rawEvent: TelegramRawEventJob,
  ): Promise<DeepPartial<EventEntity>> {
    this.#logger.debug(
      `parseRawEventJob started: ${JSON.stringify(rawEvent, null, 2)}`,
    );

    const message = this.#extractMessage(rawEvent.content);
    const eventData = await this.#llm.extractEventData(message);

    const event: DeepPartial<EventEntity> = {
      title: eventData.title,
      description: eventData.description,
      price: eventData.price,
      detailsUrl: 'test',
      sourceId: rawEvent.eventSource.id,
      sourceMessageId: rawEvent.content.id.toString(),
    };

    if (eventData.startingAt != null) {
      event.startingAt = new Date(eventData.startingAt);
    }

    if (eventData.endingAt != null) {
      event.endingAt = new Date(eventData.endingAt);
    }

    this.#logger.debug(
      `parseRawEventJob finished: ${JSON.stringify(event, null, 2)}`,
    );
    return event;
  }

  // TODO: make declarative like with scrappers
  #extractMessage({ content }: message): string {
    if (this.#isTextContent(content)) {
      return content.text.text;
    } else if (this.#isImageContent(content)) {
      return content.caption.text;
    } else {
      throw new Error(
        `Can't extract message from with content of type [${content._}]`,
      );
    }
  }

  #isTextContent(content: MessageContent): content is messageText {
    return content._ === 'messageText';
  }

  #isImageContent(content: MessageContent): content is messagePhoto {
    return content._ === 'messagePhoto';
  }
}
