import { getContext } from "hono/context-storage";
import type { Context } from "../../shared/context/context.ts";
import {
	type Chain,
	chains,
	selectChainSchema,
} from "../../shared/schema/chains.ts";

export async function selectChains(): Promise<Array<Chain>> {
	const { db } = getContext<Context>().var;

	return (await db.select().from(chains)).map((chain) =>
		selectChainSchema.parse(chain),
	);
}
