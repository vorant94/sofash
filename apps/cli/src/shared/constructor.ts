export type AbstractConstructor<T = object> = abstract new (
  ...args: any[]
) => T;
