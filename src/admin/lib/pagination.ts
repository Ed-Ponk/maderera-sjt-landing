export const PAGE_SIZE = 15;

export function clampPage(rawPage: string | undefined, total: number): number {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requested = Number(rawPage);
  if (!Number.isInteger(requested) || requested < 1) return 1;
  return Math.min(requested, pages);
}
