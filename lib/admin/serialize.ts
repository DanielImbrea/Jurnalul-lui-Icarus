/** JSON-safe copy for passing Prisma rows into client components. */
export function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

export function jsonClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
