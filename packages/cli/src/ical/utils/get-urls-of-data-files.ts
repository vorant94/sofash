import { URL } from "node:url";

export function getUrlsOfDataFiles(
	cinemaName: string,
	branchName: string,
): [URL, URL] {
	const base = "https://vorant94.github.io/";
	const icsUrl = new URL(`sofash/${cinemaName}-${branchName}.ics`, base);
	const jsonUrl = new URL(`sofash/${cinemaName}-${branchName}.json`, base);

	return [icsUrl, jsonUrl];
}
