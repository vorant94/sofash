import consola from "consola";
import { addMinutes } from "date-fns";
import type { ICalCalendar } from "ical-generator";
import type { FindFilmEventsResponseBody } from "../models/film-event.client.js";
import type { Film } from "../models/film.model.js";

export function fillCalendarWithFilmEvents(
	calendar: ICalCalendar,
	{ body: { films, events } }: FindFilmEventsResponseBody,
): void {
	const existingEvents = new Set<string>(
		calendar.events().map((event) => event.id()),
	);
	const filmById = new Map<string, Film>(films.map((film) => [film.id, film]));

	for (const event of events) {
		if (existingEvents.has(event.id)) {
			consola.debug(
				`Skipping event with id ${event.id} since it is already in calendar`,
			);
			continue;
		}

		const film = filmById.get(event.filmId);
		if (!film) {
			throw new Error(`Film with id ${event.filmId} not found!`);
		}

		calendar.createEvent({
			id: event.id,
			summary: film.name,
			start: event.eventDateTime,
			end: addMinutes(event.eventDateTime, film.length),
		});
	}
}
