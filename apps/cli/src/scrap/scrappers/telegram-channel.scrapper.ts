import { type Scrapper } from './scrapper.js';
import { type Client } from 'tdl';
import { type message } from 'tdlib-types';
import { type TelegramRawEventJob } from 'mq';
import { type EventSourceEntity } from 'db';

export class TelegramChannelScrapper
  implements Scrapper<EventSourceEntity<'telegram'>, TelegramRawEventJob>
{
  #telegram: Client;

  constructor(telegram: Client) {
    this.#telegram = telegram;
  }

  async scrapEventSource({
    uri,
    latestScrappedMessageId,
  }: EventSourceEntity<'telegram'>): Promise<
    Array<TelegramRawEventJob['content']>
  > {
    const res: message[] = [];

    const { id } = await this.#telegram.invoke({
      _: 'searchPublicChat',
      username: uri,
    });

    // because of telegram optimization reasons the first request can return
    // fewer messages than requested. in order to avoid it, we at first request
    // only latest message, than we can "paginate" from it by using its id and
    // guaranteed get the number of messages we wanted
    const {
      messages: [latestMessage],
    } = await this.#telegram.invoke({
      _: 'getChatHistory',
      chat_id: id,
      only_local: false,
      limit: 1,
    });
    if (latestMessage == null) {
      throw new Error(`This tg channel [${uri}] has no messages`);
    }

    if (
      latestScrappedMessageId !== null &&
      latestMessage.id === Number(latestScrappedMessageId)
    ) {
      console.log(
        `scrapped 0 messages for event source [${uri}], since there are no new messages`,
      );
      return res;
    }

    res.push(latestMessage);

    const { messages } = await this.#telegram.invoke({
      _: 'getChatHistory',
      chat_id: id,
      only_local: false,
      limit: 100,
      from_message_id: latestMessage.id,
    });

    res.push(
      ...messages.filter((message): message is message => Boolean(message)),
    );

    if (latestScrappedMessageId == null) {
      console.log(
        `scrapped [${res.length}] messages for event source [${uri}], didn't slice because latest scrapped message id wasn't provided`,
      );
      return res;
    }

    const latestScrappedMessageIndex = res.findIndex(
      (message) => message.id === Number(latestScrappedMessageId),
    );
    if (latestScrappedMessageIndex !== -1) {
      res.splice(latestScrappedMessageIndex);

      console.log(
        `scrapped [${res.length}] messages in total for event source [${uri}], sliced to prev last message [${latestScrappedMessageId}]`,
      );
      return res;
    }

    console.log(
      `scrapped [${res.length}] messages for event source [${uri}], didn't catch up to prev last message [${latestScrappedMessageId}] since it wasn't in latest 100`,
    );
    return res;
  }

  createRawEventJob(
    eventSource: EventSourceEntity<'telegram'>,
    content: TelegramRawEventJob['content'],
  ): TelegramRawEventJob {
    return {
      name: `${eventSource.uri}::${content.id.toString()}`,
      eventSource,
      content,
    };
  }

  getScrappedMessageId(content: TelegramRawEventJob['content']): string {
    return content.id.toString();
  }
}
