import { URL } from "node:url";
import consola from "consola";
import { format } from "date-fns";
import { z } from "zod";
import { config } from "../globals/config.js";
import type { CinemaId } from "../types/cinema-id.js";
import { filmEventSchema } from "./film-event.model.js";
import { filmSchema } from "./film.model.js";

export async function findFilmEvents(
	cinemaId: CinemaId,
	date: Date,
): Promise<FindFilmEventsResponseBody> {
	const formattedDate = format(date, "yyyy-MM-dd");

	const url = new URL(
		`/rh/data-api-service/v1/quickbook/${config.tenantId}/film-events/in-cinema/${cinemaId}/at-date/${formattedDate}`,
		config.baseUrl,
	);

	let response: Response;
	try {
		response = await fetch(url);
	} catch (e) {
		consola.error("Failed to fetch", url.toString());
		throw e;
	}

	let body: unknown;
	try {
		body = await response.json();
	} catch (e) {
		consola.error("Failed to parse response body from", url.toString());
		throw e;
	}

	try {
		const parsed = findFilmEventsResponseBodySchema.parse(body);
		consola.debug(
			`Fetched ${parsed.body.films.length} films and ${parsed.body.events.length} events`,
		);

		return parsed;
	} catch (e) {
		consola.error(
			"Response body didn't pass schema validation",
			url.toString(),
		);
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
