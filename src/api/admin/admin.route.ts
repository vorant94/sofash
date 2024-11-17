import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { getContext } from "hono/context-storage";
import type { Context } from "../../shared/context/context.ts";
import { usersRoute } from "./users.route.ts";

export const adminRoute = new Hono();

adminRoute.use((hc, next) => {
	const { env } = getContext<Context>().var;

	return basicAuth({
		username: env.ADMIN_USERNAME,
		password: env.ADMIN_PASSWORD,
	})(hc, next);
});

adminRoute.route("/users", usersRoute);
