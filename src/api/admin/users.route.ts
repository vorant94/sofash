import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { promoteUserToAdmin } from "../../bl/users/users.bl.ts";
import { userSchema } from "../../shared/schema/users.ts";

export const usersRoute = new Hono();

usersRoute.put(
	"/:id/promote-to-admin",
	zValidator(
		"param",
		z.object({
			id: z.string(),
		}),
	),
	async (hc) => {
		const user = await promoteUserToAdmin(hc.req.param("id"));

		return hc.json(userDtoSchema.parse(user));
	},
);

const userDtoSchema = userSchema.omit({
	resourceType: true,
	createdAt: true,
	updatedAt: true,
});
