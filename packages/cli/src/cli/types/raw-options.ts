export type RawOptions<T> = Partial<{
  [K in keyof T]: string;
}>;
