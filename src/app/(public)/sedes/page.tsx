import { redirect } from "next/navigation";
import { getDefaultSede } from "@/sedes/lib/default-sede";

export const dynamic = "force-dynamic";

export default async function SedesIndexPage() {
  const sede = await getDefaultSede();
  if (!sede) redirect("/");
  redirect(`/sedes/${sede.slug}`);
}
