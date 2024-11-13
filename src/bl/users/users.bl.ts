import {
	createUser,
	findUserByTelegramChatId,
} from "../../dal/users/users.table.ts";
import type { User } from "../../shared/schema/users.ts";

export async function findOrCreateUserByTelegramChatId(
	telegramChatId: User["telegramChatId"],
): Promise<User> {
	const existing = await findUserByTelegramChatId(telegramChatId);
	if (existing) {
		return existing;
	}

	return await createUser({ telegramChatId });
}
