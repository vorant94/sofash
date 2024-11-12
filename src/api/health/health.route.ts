import { Hono } from "hono";

export const healthRoute = new Hono();

healthRoute.get("/", (hc) => hc.text("OK"));
