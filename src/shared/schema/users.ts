import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import {
	type AnySQLiteColumn,
	integer,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { resourceType } from "./resource-types.ts";

export const users = sqliteTable("users", {
	id: text()
		.primaryKey()
		.$default(() => randomUUID()),
	resourceType: text({ enum: [resourceType.user] })
		.notNull()
		.default(resourceType.user),
	createdAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
	createdBy: text().references((): AnySQLiteColumn => users.id),
	updatedAt: text()
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),

	telegramChatId: integer().notNull().unique(),
});

export const userSchema = createSelectSchema(users);

export type User = z.infer<typeof userSchema>;

export const createUserSchema = createInsertSchema(users).omit({
	id: true,
	resourceType: true,
	createdAt: true,
	createdBy: true,
	updatedAt: true,
});

export type InsertUser = z.infer<typeof createUserSchema>;
