import fs from "node:fs/promises";
import consola from "consola";
import ical, {
	type ICalCalendar,
	type ICalCalendarJSONData,
} from "ical-generator";
import { env } from "../../config/globals/env.js";
import { getPathsOfDataFiles } from "./get-paths-of-data-files.js";
import { getUrlsOfDataFiles } from "./get-urls-of-data-files.js";

// biome-ignore lint/style/useNamingConvention: ICal is a separate term
export async function createICalCalendar(
	cinemaName: string,
	branchName: string,
): Promise<ICalCalendar> {
	const jsonData: unknown | null =
		env.NODE_ENV === "development"
			? await getExistingICalCalendarFromLocalFilesystem(cinemaName, branchName)
			: await getExistingICalCalendarFromRemoteHost(cinemaName, branchName);

	return ical(
		jsonData ? (jsonData as ICalCalendarJSONData) : { name: branchName },
	);
}

// biome-ignore lint/style/useNamingConvention: ICal is a separate term
async function getExistingICalCalendarFromLocalFilesystem(
	cinemaName: string,
	branchName: string,
): Promise<unknown | null> {
	const [_, jsonPath] = await getPathsOfDataFiles(cinemaName, branchName);

	let data: unknown | null = null;

	try {
		data = JSON.parse(await fs.readFile(jsonPath, { encoding: "utf-8" }));
		consola.debug(
			"Found previous events file locally, will add new events to it",
		);
	} catch (_e) {
		consola.debug("No previous events file found, will create a new one");
	}

	return data;
}

// biome-ignore lint/style/useNamingConvention: ICal is a separate term
async function getExistingICalCalendarFromRemoteHost(
	cinemaName: string,
	branchName: string,
): Promise<unknown | null> {
	const [_, jsonUrl] = getUrlsOfDataFiles(cinemaName, branchName);

	let data: unknown | null = null;

	try {
		const response = await fetch(jsonUrl);
		data = await response.json();
		consola.debug(
			"Found previous events file remotely, will add new events to it",
		);
	} catch (_e) {
		consola.debug("No previous events file found, will create a new one");
	}

	return data;
}
