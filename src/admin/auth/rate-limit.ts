const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

const failures = new Map<string, number[]>();

function prune(ip: string): number[] {
  const now = Date.now();
  const list = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length === 0) failures.delete(ip);
  else failures.set(ip, list);
  return list;
}

export function tooManyAttempts(ip: string): boolean {
  return prune(ip).length >= MAX_FAILURES;
}

export function recordFailure(ip: string): void {
  const list = prune(ip);
  list.push(Date.now());
  failures.set(ip, list);
}

export function clearFailures(ip: string): void {
  failures.delete(ip);
}
