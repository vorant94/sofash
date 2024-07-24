import { z } from "zod";
import type { BranchName } from "./branch-name.js";

export const branchIds = ["1058", "1071", "1062"] as const;
export type BranchId = (typeof branchIds)[number];
export const branchIdSchema = z.enum(branchIds);

export const branchIdToBranchName = {
	1058: "givataiim",
	1071: "dizengoff",
	1062: "kiryat ono",
} as const satisfies Record<BranchId, BranchName>;
