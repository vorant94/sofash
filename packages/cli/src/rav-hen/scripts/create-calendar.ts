import fs from "node:fs/promises";
import { parseArgs } from "node:util";
import consola from "consola";
import { differenceInDays } from "date-fns";
import { z } from "zod";
import { createICalCalendar } from "../../ical/utils/create-ical-calendar.js";
import { getPathsOfDataFiles } from "../../ical/utils/get-paths-of-data-files.js";
import { findFilmEvents } from "../models/film-event.client.js";
import {
	branchNameSchema,
	branchNameToBranchId,
} from "../types/branch-name.js";
import { fillCalendarWithFilmEvents } from "../utils/fill-calendar-with-film-events.js";

consola.start("Creating Rav-Hen calendar");

consola.info("Parsing CLI args");
const args = parseArgs({
	options: {
		branchName: {
			type: "string",
			short: "b",
		},
		date: {
			type: "string",
			short: "d",
		},
	},
});
const argsSchema = z.object({
	branchName: branchNameSchema,
	date: z.coerce.date().superRefine((value, context) => {
		const date = new Date(value);
		if (differenceInDays(date, new Date()) < 0) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: `date shouldn't be less than today`,
			});
		}
	}),
});
const { branchName, date } = argsSchema.parse(args.values);

consola.info("Ensuring data dir is in place");
const [icsPath, jsonPath] = await getPathsOfDataFiles("rav-hen", branchName);

consola.info("Creating calendar");
const calendar = await createICalCalendar("rav-hen", branchName);

consola.info("Fetching film events...");
const data = await findFilmEvents(branchNameToBranchId[branchName], date);

consola.info("Filling calendar with fetched events...");
fillCalendarWithFilmEvents(calendar, data);

consola.info("Saving calendar files...");
await Promise.all([
	fs.writeFile(icsPath, calendar.toString()),
	fs.writeFile(jsonPath, JSON.stringify(calendar)),
]);

consola.success("Successfully created Ran-Hen calendar");
