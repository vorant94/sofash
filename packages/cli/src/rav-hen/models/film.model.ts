import { z } from "zod";

export const filmSchema = z.object({
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

export type Film = z.infer<typeof filmSchema>;
