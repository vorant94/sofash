import { fromZonedTime } from "date-fns-tz";
import { z } from "zod";
import { config } from "../globals/config.js";

export const filmEventSchema = z.object({
	id: z.string(),
	filmId: z.string(),
	cinemaId: z.string(),
	businessDay: z.string().date(),
	eventDateTime: z.preprocess(
		(value) => fromZonedTime(z.string().parse(value), config.timeZone),
		z.date(),
	),
	attributeIds: z.array(z.string()),
	bookingLink: z.string().url(),
	compositeBookingLink: z.object({
		type: z.string(),
		bookingUrl: z.object({
			url: z.string().url(),
			params: z.object({
				languageId: z.string(),
				saleChannelCode: z.string(),
				code: z.string(),
			}),
		}),
		obsoleteBookingUrl: z.string().url(),
		blockOnlineSales: z.boolean(),
		blockOnlineSalesUntil: z.string().date(),
		serviceUrl: z.string().url(),
	}),
	presentationCode: z.string(),
	soldOut: z.boolean(),
	auditorium: z.string(),
	auditoriumTinyName: z.string(),
});

export type FilmEvent = z.infer<typeof filmEventSchema>;
