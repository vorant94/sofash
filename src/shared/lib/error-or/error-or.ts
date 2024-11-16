import type { Constructor } from "../constructor.ts";

export type ErrorOr<T, E extends Constructor<Error>> =
	| [InstanceType<E>]
	| [undefined, T];
