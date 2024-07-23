import fs from "node:fs/promises";
import consola from "consola";
import ical, {
	type ICalCalendar,
	type ICalCalendarJSONData,
} from "ical-generator";

// biome-ignore lint/style/useNamingConvention: ICal is a separate term
export async function createICalCalendar(
	jsonPath: string,
	name: string,
): Promise<ICalCalendar> {
	let jsonData: string | null = null;
	try {
		jsonData = await fs.readFile(jsonPath, { encoding: "utf-8" });
		consola.debug("Found previous events file, will add new events to it");
	} catch (_e) {
		consola.debug("No previous events file found, will create a new one");
	}

	return ical(
		jsonData ? (JSON.parse(jsonData) as ICalCalendarJSONData) : { name },
	);
}
