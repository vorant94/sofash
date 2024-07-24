import { z } from "zod";

export const logLevels = ["info", "debug"] as const;
export type LogLevel = (typeof logLevels)[number];
export const logLevelSchema = z.enum(logLevels).default("info");

export const logLevelToConsolaLevel = {
	info: 3,
	debug: 4,
} as const satisfies Record<LogLevel, number>;
