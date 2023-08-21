import { Composer } from 'telegraf';
import { message } from 'telegraf/filters';

export const COMPOSER = new Composer().on(message(), async (ctx) => {
  await ctx.copyMessage(ctx.message.chat.id);
});
