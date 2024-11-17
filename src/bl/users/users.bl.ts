import {
	createUser,
	findUserByTelegramChatId,
	setUserRole,
} from "../../dal/db/users.table.ts";
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

export async function promoteUserToAdmin(id: User["id"]): Promise<User> {
	return await setUserRole(id, "admin");
}
