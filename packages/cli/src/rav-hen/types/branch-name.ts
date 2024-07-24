import { z } from "zod";
import type { BranchId } from "./branch-id.js";

export const branchNames = ["givataiim", "dizengoff", "kiryat ono"] as const;
export type BranchName = (typeof branchNames)[number];
export const branchNameSchema = z.enum(branchNames);

export const branchNameToBranchId = {
	givataiim: "1058",
	dizengoff: "1071",
	"kiryat ono": "1062",
} as const satisfies Record<BranchName, BranchId>;
