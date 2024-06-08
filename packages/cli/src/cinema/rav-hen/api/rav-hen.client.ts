import consola from 'consola';
import { format } from 'date-fns';
import { z } from 'zod';
import { ravHenConfig } from './rav-hen.config.js';
import {
  ravHenEventSchema,
  ravHenFilmSchema,
  type RavHenCinemaId,
} from './rav-hen.models.js';

export const ravHenClient = {
  async fetchFilmEvents(
    cinemaId: RavHenCinemaId,
    date: Date,
  ): Promise<FetchFilmEventsResponseBody> {
    const formattedDate = format(date, 'yyyy-MM-dd');

    const url = new URL(
      `/rh/data-api-service/v1/quickbook/${ravHenConfig.tenantId}/film-events/in-cinema/${cinemaId}/at-date/${formattedDate}`,
      ravHenConfig.baseUrl,
    );

    let response: Response;
    try {
      response = await fetch(url);
    } catch (e) {
      consola.error(`Failed to fetch`, url.toString());
      throw e;
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch (e) {
      consola.error(`Failed to parse response body from`, url.toString());
      throw e;
    }

    try {
      const parsed = fetchFilmEventsResponseBodySchema.parse(body);
      consola.debug(
        `Fetched ${parsed.body.films.length} films and ${parsed.body.events.length} events`,
      );

      return parsed;
    } catch (e) {
      consola.error(
        `Response body didn't pass schema validation`,
        url.toString(),
      );
      throw e;
    }
  },
} as const;

export const fetchFilmEventsResponseBodySchema = z.object({
  body: z.object({
    films: z.array(ravHenFilmSchema),
    events: z.array(ravHenEventSchema),
  }),
});

export type FetchFilmEventsResponseBody = z.infer<
  typeof fetchFilmEventsResponseBodySchema
>;
