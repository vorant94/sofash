import { Hono } from "hono";
import { chainsRoute } from "./chains.route.ts";

export const apiRoute = new Hono();

apiRoute.route("/chains", chainsRoute);
