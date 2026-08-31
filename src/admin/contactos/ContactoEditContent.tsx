import { prisma } from "@/shared/lib/prisma";
import { ContactoForm } from "./ContactoForm";
import type { ContactoFormValues } from "./schema";

export async function ContactoEditContent({ id }: { id: string }) {
  const contacto = await prisma.contacto.findUnique({ where: { id } });

  if (!contacto) return null;

  const initial: ContactoFormValues = {
    nombre: contacto.nombre,
    whatsapp: contacto.whatsapp,
    cargo: contacto.cargo ?? null,
    activo: contacto.activo,
  };

  return <ContactoForm initial={initial} contactoId={contacto.id} />;
}
