import { fromZonedTime } from 'date-fns-tz';
import { z } from 'zod';
import { ravHenConfig } from './rav-hen.config.js';

export const ravHenFilmSchema = z.object({
  id: z.string(),
  name: z.string(),
  length: z.number(),
  posterLink: z.string().url(),
  videoLink: z.string().url(),
  link: z.string().url(),
  weight: z.number(),
  releaseYear: z.string(),
  attributeIds: z.array(z.string()),
});

export type RavHenFilm = z.infer<typeof ravHenFilmSchema>;

export const ravHenEventSchema = z.object({
  id: z.string(),
  filmId: z.string(),
  cinemaId: z.string(),
  businessDay: z.string().date(),
  eventDateTime: z.preprocess(
    (value) => fromZonedTime(z.string().parse(value), ravHenConfig.timeZone),
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

export type RavHenEvent = z.infer<typeof ravHenEventSchema>;

export const ravHenCinemaIds = ['1058', '1071', '1062'] as const;
export type RavHenCinemaId = (typeof ravHenCinemaIds)[number];
export const ravHenCinemaIdSchema = z.enum(ravHenCinemaIds);
