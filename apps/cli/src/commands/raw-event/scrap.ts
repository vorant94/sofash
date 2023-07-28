import { Command } from '@oclif/core';
import { envMixin } from '../../shared/env.mixin.js';
import { dbMixin } from '../../shared/db.mixin.js';
import { telegramMixin } from '../../shared/telegram.mixin.js';
import { type message } from 'tdlib-types';
import {
  type EventSource,
  isTelegramEventSource,
  type TelegramEventSource,
} from 'db';
import { type Client } from 'tdl';

export default class Scrap extends telegramMixin(dbMixin(envMixin(Command))) {
  async run(): Promise<void> {
    const eventSources = await this.collectEventSources();

    const esToResult = await this.processEventSources(eventSources);

    this.logResults(esToResult);
  }

  // TODO add flags to scrap
  //  - for all event sources
  //  - for all event sources of a specific type
  //  - for a specific event source by its uri
  private async collectEventSources(): Promise<EventSource[]> {
    const eventSources = await this.db.eventSources.findAll();

    this.log(`collected [${eventSources.length}] event sources to scrap`);
    return eventSources;
  }

  private async processEventSources(
    eventSources: EventSource[],
  ): Promise<Map<EventSource, PromiseSettledResult<void>>> {
    const results = await this.usingTelegram(
      async (telegram) =>
        await Promise.allSettled(
          eventSources.map(async (es) => {
            await this.processEventSource(es, telegram);
          }),
        ),
    );

    const res = new Map<EventSource, PromiseSettledResult<void>>();
    for (const [index, es] of eventSources.entries()) {
      res.set(es, results[index]);
    }
    return res;
  }

  private async processEventSource(
    es: EventSource,
    telegram: Client,
  ): Promise<void> {
    const messages = await this.scrapEventSourceByType(es, telegram);
    if (messages.length === 0) {
      return;
    }

    const latestScrappedMessageId = await this.fillRawEventsQueue(es, messages);

    await this.updateLatestScrappedMessageId(es, latestScrappedMessageId);
  }

  private async scrapEventSourceByType(
    es: EventSource,
    telegram: Client,
  ): Promise<message[]> {
    if (isTelegramEventSource(es)) {
      return await this.scrapTelegramEventSource(es, telegram);
    }

    throw new Error(
      `Unsupported event type [${es.type}] of event source [${es.uri}]`,
    );
  }

  private async scrapTelegramEventSource(
    es: TelegramEventSource,
    telegram: Client,
  ): Promise<message[]> {
    const res: message[] = [];

    const { id } = await telegram.invoke({
      _: 'searchPublicChat',
      username: es.uri,
    });

    // because of telegram optimization reasons the first request can return
    // fewer messages than requested. in order to avoid it, we at first request
    // only latest message, than we can "paginate" from it by using its id and
    // guaranteed get the number of messages we wanted
    const {
      messages: [latestMessage],
    } = await telegram.invoke({
      _: 'getChatHistory',
      chat_id: id,
      only_local: false,
      limit: 1,
    });
    if (latestMessage == null) {
      throw new Error(`This tg channel [${es.uri}] has no messages`);
    }

    if (
      es.latestScrappedMessageId !== null &&
      latestMessage.id === Number(es.latestScrappedMessageId)
    ) {
      this.log(
        `scrapped 0 raw events for event source [${es.uri}], since there are no new messages`,
      );
      return res;
    }

    res.push(latestMessage);

    const { messages } = await telegram.invoke({
      _: 'getChatHistory',
      chat_id: id,
      only_local: false,
      limit: 100,
      from_message_id: latestMessage.id,
    });

    res.push(
      ...messages.filter((message): message is message => Boolean(message)),
    );

    if (es.latestScrappedMessageId == null) {
      this.log(
        `scrapped [${res.length}] messages for event source [${es.uri}], didn't slice because latest scrapped message id wasn't provided`,
      );
      return res;
    }

    const latestScrappedMessageIndex = res.findIndex(
      (message) => message.id === Number(es.latestScrappedMessageId),
    );
    if (latestScrappedMessageIndex !== -1) {
      res.splice(latestScrappedMessageIndex);

      this.log(
        `scrapped [${res.length}] messages in total for event source [${es.uri}], sliced to prev last message [${es.latestScrappedMessageId}]`,
      );
      return res;
    }

    this.log(
      `scrapped [${res.length}] messages for event source [${es.uri}], didn't catch up to prev last message [${es.latestScrappedMessageId}] since it wasn't in latest 100`,
    );
    return res;
  }

  private async fillRawEventsQueue(
    _: EventSource,
    messages: message[],
  ): Promise<string> {
    if (messages.length === 0) {
      throw new Error(`Tried to fill messages, but got empty messages array`);
    }

    // TODO: fill redis queue here

    return messages[0].id.toString();
  }

  private async updateLatestScrappedMessageId(
    es: EventSource,
    latestScrappedMessageId: string,
  ): Promise<void> {
    await this.db.eventSources.updateLatestScrappedMessageId(
      es.id,
      latestScrappedMessageId,
    );
  }

  private logResults(
    esToResult: Map<EventSource, PromiseSettledResult<void>>,
  ): void {
    const esUriToReason = new Map<string, string>();
    for (const [es, result] of esToResult) {
      if (result.status === 'rejected') {
        esUriToReason.set(es.uri, result.reason);
      }
    }

    const successCount = esToResult.size - esUriToReason.size;
    this.log(`successfully scrapped [${successCount}] event sources`);

    if (esUriToReason.size === 0) {
      this.log(`no event source failed to scrap`);
      return;
    }

    for (const [uri, reason] of esUriToReason) {
      this.log(
        `event source [${uri}] finished with errors [${JSON.stringify(
          reason,
          null,
          2,
        )}]`,
      );
    }
  }
}
