import type { Constructor } from "../constructor.ts";

export type ErrorOr<T, E extends Constructor<Error>> =
	| [undefined, T]
	| [InstanceType<E>];
