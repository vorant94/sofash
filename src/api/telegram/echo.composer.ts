import { Composer } from "grammy";

export const echoComposer = new Composer();

echoComposer.on("message", (tc) => {
	return tc.reply(tc.message.text ?? "no text in your message");
});
