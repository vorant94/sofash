import { sql } from "drizzle-orm";
import { getContext } from "hono/context-storage";
import type { Context } from "../../shared/context/context.ts";
import {
	type InsertUser,
	type User,
	createUserSchema,
	userSchema,
	users,
} from "../../shared/schema/users.ts";

export async function createUser(raw: InsertUser): Promise<User> {
	const { db, user } = getContext<Context>().var;

	const toCreate = createUserSchema.parse(raw);

	return userSchema.parse(
		await db
			.insert(users)
			.values({ ...toCreate, createdBy: user?.id })
			.returning(),
	);
}

export async function findUserByTelegramChatId(
	telegramChatId: User["telegramChatId"],
): Promise<User | null> {
	const { db } = getContext<Context>().var;

	const [raw] = await db
		.select()
		.from(users)
		.where(sql`${users.telegramChatId} = ${telegramChatId}`);

	return raw ? userSchema.parse(raw) : null;
}
