import console from "node:console";
import { inspect, parseArgs } from "node:util";
import { addDays, format } from "date-fns";
import { z } from "zod";

const { tenantId, cinemaId, date } = z
	.object({
		tenantId: z.coerce.number().default(10104),
		cinemaId: z.coerce.number().default(1058),
		date: z.coerce.date().default(addDays(new Date(), 1)),
	})
	.parse(
		parseArgs({
			options: {
				tenantId: {
					type: "string",
				},
				cinemaId: {
					type: "string",
				},
				date: {
					type: "string",
				},
			},
		}).values,
	);

const response = await fetch(
	`https://www.rav-hen.co.il/rh/data-api-service/v1/quickbook/${tenantId}/film-events/in-cinema/${cinemaId}/at-date/${format(date, "yyyy-MM-dd")}`,
);
const json = await response.json();

console.info(
	inspect(json, {
		colors: true,
		depth: Number.POSITIVE_INFINITY,
		maxArrayLength: Number.POSITIVE_INFINITY,
	}),
);
