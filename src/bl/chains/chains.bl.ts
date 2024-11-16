import { findAllChains } from "../../dal/db/chains.table.ts";
import type { Chain } from "../../shared/schema/chains.ts";

export async function findChains(): Promise<Array<Chain>> {
	return await findAllChains();
}
