export const resourceTypes = ["chain", "user"] as const;

export type ResourceType = (typeof resourceTypes)[number];

export const resourceType = {
	chain: "chain",
	user: "user",
} as const satisfies Record<ResourceType, ResourceType>;
