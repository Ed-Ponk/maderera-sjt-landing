import { Modal } from "@/admin/ui/Modal";
import { ContactoEditContent } from "@/admin/contactos/ContactoEditContent";

export const dynamic = "force-dynamic";

export default async function EditarContactoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal title="Editar contacto">
      <ContactoEditContent id={id} />
    </Modal>
  );
}
