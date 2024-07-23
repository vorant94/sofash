import { z } from "zod";

export const cinemaIdToName = {
	1058: "givataiim",
	1071: "dizengoff",
	1062: "kiryat ono",
} as const satisfies Record<CinemaId, string>;

export const cinemaIds = ["1058", "1071", "1062"] as const;
export type CinemaId = (typeof cinemaIds)[number];
export const cinemaIdSchema = z.enum(cinemaIds);
