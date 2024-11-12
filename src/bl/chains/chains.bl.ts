import { selectChains } from "../../dal/chains/chains.table.ts";
import type { Chain } from "../../shared/schema/chains.ts";

export async function listChains(): Promise<Array<Chain>> {
	return await selectChains();
}
