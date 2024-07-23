import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

export async function getPathsOfDataFiles(
	cinemaName: string,
	branchName: string,
): Promise<[string, string]> {
	const dataDir = path.resolve(process.cwd(), "data");
	await fs.mkdir(dataDir, { recursive: true });
	const icsPath = path.resolve(dataDir, `${cinemaName}-${branchName}.ics`);
	const jsonPath = path.resolve(dataDir, `${cinemaName}-${branchName}.json`);

	return [icsPath, jsonPath];
}
