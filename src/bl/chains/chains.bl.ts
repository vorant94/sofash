import { findAllChains } from "../../dal/chains/chains.table.ts";
import type { Chain } from "../../shared/schema/chains.ts";

export async function findChains(): Promise<Array<Chain>> {
	return await findAllChains();
}
