import type { Constructor } from "./constructor.ts";

export type ErrorOr<T, E extends Constructor<Error>> =
	| [undefined, T]
	| [InstanceType<E>];

export function catchError<T, E extends Constructor<Error>>(
	callback: () => T,
	errorsTypesToCatch?: Array<E>,
): ErrorOr<T, E> {
	try {
		return [undefined, callback()];
	} catch (e) {
		if (!errorsTypesToCatch) {
			console.error(e);
			return [e as InstanceType<E>];
		}

		if (errorsTypesToCatch.some((errorType) => e instanceof errorType)) {
			console.error(e);
			return [e as InstanceType<E>];
		}

		throw e;
	}
}

export function reThrowError<T, E extends Constructor<Error>>(
	result: ErrorOr<T, E>,
): T {
	const [error, data] = result;
	if (error) {
		throw error;
	}

	return data as T;
}

export async function catchErrorAsync<T, E extends Constructor<Error>>(
	promise: Promise<T>,
	errorsTypesToCatch?: Array<E>,
): Promise<ErrorOr<T, E>> {
	try {
		return [undefined, await promise];
	} catch (e) {
		if (!errorsTypesToCatch) {
			console.error(e);
			return [e as InstanceType<E>];
		}

		if (errorsTypesToCatch.some((errorType) => e instanceof errorType)) {
			console.error(e);
			return [e as InstanceType<E>];
		}

		throw e;
	}
}

export async function reThrowErrorAsync<T, E extends Constructor<Error>>(
	result: Promise<ErrorOr<T, E>>,
): Promise<T> {
	const [error, data] = await result;
	if (error) {
		throw error;
	}

	return data as T;
}
