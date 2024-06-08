import { Command } from 'commander';
import consola from 'consola';
import { addDays, addMinutes, differenceInDays } from 'date-fns';
import ical, {
  type ICalCalendar,
  type ICalCalendarJSONData,
} from 'ical-generator';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { z } from 'zod';
import type { RawOptions } from '../../cli/types/raw-options.js';
import {
  ravHenClient,
  type FetchFilmEventsResponseBody,
} from './api/rav-hen.client.js';
import { ravHenConfig } from './api/rav-hen.config.js';
import {
  ravHenCinemaIdSchema,
  ravHenCinemaIds,
  type RavHenCinemaId,
  type RavHenFilm,
} from './api/rav-hen.models.js';

export const ravHenCommand = new Command('rav-hen')
  .option(`--cinemaId <string>`)
  .option(`--date <string>`)
  .action(async (rawOptions: RawOptions<Options>) => {
    consola.start(`Creating Rav-Hen calendar`);
    const { cinemaId, date } = await parseOptions(rawOptions);

    consola.info(`Ensuring data dir is in place`);
    const [icsPath, jsonPath] = await getPathsOfDataFiles(cinemaId);

    consola.info(`Creating calendar`);
    const calendar = await createCalendar(jsonPath);

    consola.info(`Fetching film events...`);
    const data = await ravHenClient.fetchFilmEvents(cinemaId, date);

    consola.info(`Filling calendar with fetched events...`);
    fillCalendar(calendar, data);

    consola.info(`Saving calendar files...`);
    await Promise.all([
      fs.writeFile(icsPath, calendar.toString()),
      fs.writeFile(jsonPath, JSON.stringify(calendar)),
    ]);

    consola.success(`Successfully created Ran-Hen calendar`);
  });

interface Options {
  cinemaId: RavHenCinemaId;
  date: Date;
}

async function parseOptions(raw: RawOptions<Options>): Promise<Options> {
  const cinemaId = raw.cinemaId
    ? ravHenCinemaIdSchema.parse(raw.cinemaId)
    : ((await consola.prompt(
        `Select cinema`,
        cinemaIdPromptOptions,
      )) as unknown as RavHenCinemaId);

  const date = new Date(
    raw.date
      ? dateOptionSchema.parse(raw.date)
      : ((await consola.prompt(
          `Select date`,
          datePromptOptions,
        )) as unknown as string),
  );

  return { cinemaId, date };
}

const dateOptionSchema = z
  .string()
  .date()
  .superRefine((value, context) => {
    const date = new Date(value);
    if (differenceInDays(date, new Date()) < 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `date shouldn't be less than today`,
      });
    }
  });

const cinemaIdPromptOptions = {
  type: 'select',
  options: ravHenCinemaIds.map((value) => ({
    label: ravHenConfig.cinemaIdToName[value],
    value,
  })),
} as const satisfies Parameters<typeof consola.prompt>[1];

const datePromptOptions = {
  type: 'select',
  options: [
    {
      label: 'today',
      value: new Date().toISOString(),
    },
    {
      label: 'tomorrow',
      value: addDays(new Date(), 1).toISOString(),
    },
    {
      label: 'day after tomorrow',
      value: addDays(new Date(), 2).toISOString(),
    },
  ],
} as const satisfies Parameters<typeof consola.prompt>[1];

async function getPathsOfDataFiles(
  cinemaId: RavHenCinemaId,
): Promise<[string, string]> {
  const dataDir = path.resolve(process.cwd(), 'data');
  await fs.mkdir(dataDir, { recursive: true });
  const icsPath = path.resolve(
    dataDir,
    `rav-hen-${ravHenConfig.cinemaIdToName[cinemaId]}.ics`,
  );
  const jsonPath = path.resolve(
    dataDir,
    `rav-hen-${ravHenConfig.cinemaIdToName[cinemaId]}.json`,
  );

  return [icsPath, jsonPath];
}

async function createCalendar(jsonPath: string): Promise<ICalCalendar> {
  let jsonData: string | null = null;
  try {
    jsonData = await fs.readFile(jsonPath, { encoding: 'utf-8' });
    consola.debug(`Found previous events file, will add new events to it`);
  } catch (e) {
    consola.debug(`No previous events file found, will create a new one`);
  }

  return ical(
    jsonData
      ? (JSON.parse(jsonData) as ICalCalendarJSONData)
      : { name: 'Rav-Hen Givataiim' },
  );
}

function fillCalendar(
  calendar: ICalCalendar,
  { body: { films, events } }: FetchFilmEventsResponseBody,
): void {
  const existingEvents = new Set<string>(
    calendar.events().map((event) => event.id()),
  );
  const filmById = new Map<string, RavHenFilm>(
    films.map((film) => [film.id, film]),
  );

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
