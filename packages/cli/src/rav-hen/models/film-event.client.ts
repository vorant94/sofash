import { URL } from "node:url";
import { format } from "date-fns";
import { z } from "zod";
import { logger } from "../../logging/globals/logger.js";
import { config } from "../globals/config.js";
import type { BranchId } from "../types/branch-id.js";
import { filmEventSchema } from "./film-event.model.js";
import { filmSchema } from "./film.model.js";

export async function findFilmEvents(
	branchId: BranchId,
	date: Date,
): Promise<FindFilmEventsResponseBody> {
	const formattedDate = format(date, "yyyy-MM-dd");

	const url = new URL(
		`/rh/data-api-service/v1/quickbook/${config.tenantId}/film-events/in-cinema/${branchId}/at-date/${formattedDate}`,
		config.baseUrl,
	);

	let response: Response;
	try {
		response = await fetch(url);
	} catch (e) {
		logger.error("Failed to fetch", url.toString());
		throw e;
	}

	let body: unknown;
	try {
		body = await response.json();
	} catch (e) {
		logger.error("Failed to parse response body from", url.toString());
		throw e;
	}

	try {
		const parsed = findFilmEventsResponseBodySchema.parse(body);
		logger.debug(
			`Fetched ${parsed.body.films.length} films and ${parsed.body.events.length} events`,
		);

		return parsed;
	} catch (e) {
		logger.error("Response body didn't pass schema validation", url.toString());
		throw e;
	}
}

export const findFilmEventsResponseBodySchema = z.object({
	body: z.object({
		films: z.array(filmSchema),
		events: z.array(filmEventSchema),
	}),
});

export type FindFilmEventsResponseBody = z.infer<
	typeof findFilmEventsResponseBodySchema
>;
