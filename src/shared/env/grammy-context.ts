import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import type { Context, SessionFlavor } from "grammy";

export type GrammyContext = Context &
	SessionFlavor<unknown> &
	ConversationFlavor;

export type GrammyConversation = Conversation<GrammyContext>;
