import { URL } from "node:url";
import { cinemaIdToName } from "../types/cinema-id.js";

export const config = {
	baseUrl: new URL("https://www.rav-hen.co.il"),
	tenantId: 10104,
	timeZone: "Asia/Jerusalem",
	cinemaIdToName,
} as const;
