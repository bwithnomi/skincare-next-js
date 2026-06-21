export function serializeJsonColumn<T>(value: T): string {
  return JSON.stringify(value);
}

export function parseJsonColumn<T>(
  value: string | null | undefined,
  fallback: T,
): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
