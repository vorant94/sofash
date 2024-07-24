import { URL } from "node:url";

export const config = {
	baseUrl: new URL("https://www.rav-hen.co.il"),
	tenantId: 10104,
	timeZone: "Asia/Jerusalem",
} as const;
