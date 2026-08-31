import { slugify } from "@/shared/lib/slug";

export async function uniqueSlug(
  base: string,
  findExisting: (slug: string) => Promise<{ id: string } | null>,
  selfId?: string
): Promise<string> {
  const candidate = slugify(base);
  let slug = candidate;

  for (let n = 2; ; n++) {
    const existing = await findExisting(slug);
    if (!existing) return slug;
    if (selfId && existing.id === selfId) return slug;
    slug = `${candidate}-${n}`;
  }
}
