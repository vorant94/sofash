import { createConsola } from "consola";
import { env } from "../../config/globals/env.js";
import { logLevelToConsolaLevel } from "../types/log-level.js";

export const logger = createConsola({
	level: logLevelToConsolaLevel[env.LOG_LEVEL],
});
