export function compact<T extends Record<string, unknown>>(object: T): T {
  return Object.fromEntries(Object.entries(object).filter(([_, v]) => v != null && v !== '')) as T;
}
