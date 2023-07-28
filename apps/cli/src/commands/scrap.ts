import { Command } from '@oclif/core';
import { envMixin } from '../shared/env.mixin.js';
import { dbMixin } from '../shared/db.mixin.js';
import { telegramMixin } from '../shared/telegram.mixin.js';
import { type message } from 'tdlib-types';
import { type EventSource, isTelegramEventSource } from 'db';
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
  ): Promise<EventSourceToResult> {
    const results = await this.usingTelegram(
      async (telegram) =>
        await Promise.allSettled(
          eventSources.map(async (eventSource) => {
            await this.processEventSource(eventSource, telegram);
          }),
        ),
    );

    const res = new Map<EventSource, PromiseSettledResult<void>>();
    for (const [index, eventSource] of eventSources.entries()) {
      res.set(eventSource, results[index]);
    }
    return res;
  }

  private async processEventSource(
    eventSource: EventSource,
    telegram: Client,
  ): Promise<void> {
    const scrapResults = await this.scrapByType(eventSource, telegram);
    if (scrapResults.length === 0) {
      return;
    }

    const latestScrappedMessageId = await this.fillByType(
      eventSource,
      scrapResults,
    );

    await this.updateLatestScrappedMessageId(
      eventSource,
      latestScrappedMessageId,
    );
  }

  private async scrapByType(
    eventSource: EventSource,
    telegram: Client,
  ): Promise<ScrapResult[]> {
    if (isTelegramEventSource(eventSource)) {
      return await this.scrapTelegram(eventSource, telegram);
    }

    throw new Error(
      `Unsupported event type [${eventSource.type}] of event source [${eventSource.uri}]`,
    );
  }

  private async scrapTelegram(
    { uri, latestScrappedMessageId }: EventSource<'telegram'>,
    telegram: Client,
  ): Promise<TelegramScrapResult[]> {
    const res: message[] = [];

    const { id } = await telegram.invoke({
      _: 'searchPublicChat',
      username: uri,
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
      throw new Error(`This tg channel [${uri}] has no messages`);
    }

    if (
      latestScrappedMessageId !== null &&
      latestMessage.id === Number(latestScrappedMessageId)
    ) {
      this.log(
        `scrapped 0 raw events for event source [${uri}], since there are no new messages`,
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

    if (latestScrappedMessageId == null) {
      this.log(
        `scrapped [${res.length}] messages for event source [${uri}], didn't slice because latest scrapped message id wasn't provided`,
      );
      return res;
    }

    const latestScrappedMessageIndex = res.findIndex(
      (message) => message.id === Number(latestScrappedMessageId),
    );
    if (latestScrappedMessageIndex !== -1) {
      res.splice(latestScrappedMessageIndex);

      this.log(
        `scrapped [${res.length}] messages in total for event source [${uri}], sliced to prev last message [${latestScrappedMessageId}]`,
      );
      return res;
    }

    this.log(
      `scrapped [${res.length}] messages for event source [${uri}], didn't catch up to prev last message [${latestScrappedMessageId}] since it wasn't in latest 100`,
    );
    return res;
  }

  private async fillByType(
    _: EventSource,
    scrapResults: ScrapResult[],
  ): Promise<string> {
    if (scrapResults.length === 0) {
      throw new Error(`Tried to fill messages, but got empty messages array`);
    }

    // TODO: fill redis queue here

    return scrapResults[0].id.toString();
  }

  private async updateLatestScrappedMessageId(
    { id }: EventSource,
    latestScrappedMessageId: string,
  ): Promise<void> {
    await this.db.eventSources.updateLatestScrappedMessageId(
      id,
      latestScrappedMessageId,
    );
  }

  private logResults(esToResult: EventSourceToResult): void {
    const esUriToReason = new Map<string, string>();
    for (const [eventSource, result] of esToResult) {
      if (result.status === 'rejected') {
        esUriToReason.set(eventSource.uri, result.reason);
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

type EventSourceToResult = Map<EventSource, PromiseSettledResult<void>>;

// TODO make it union with MeetupScrapResult
type ScrapResult = TelegramScrapResult;

type TelegramScrapResult = message;
