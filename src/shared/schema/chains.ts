import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const chains = sqliteTable("chains", {
	id: text()
		.primaryKey()
		.$default(() => randomUUID()),
	updatedAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
	createdAt: text().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const selectChainSchema = createSelectSchema(chains);

export type Chain = z.infer<typeof selectChainSchema>;
