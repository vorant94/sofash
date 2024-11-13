import { Hono } from "hono";
import { findChains } from "../../bl/chains/chains.bl.ts";

export const chainsRoute = new Hono();

chainsRoute.get("/", async (hc) => hc.json(await findChains()));
