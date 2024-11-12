import { Hono } from "hono";
import { listChains } from "../../bl/chains/chains.bl.ts";

export const chainsRoute = new Hono();

chainsRoute.get("/", async (hc) => hc.json(await listChains()));
