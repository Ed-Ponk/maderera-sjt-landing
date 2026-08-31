import { Modal } from "@/admin/ui/Modal";
import { ContactoForm } from "@/admin/contactos/ContactoForm";

export const dynamic = "force-dynamic";

export default function NuevoContactoModal() {
  return (
    <Modal title="Nuevo contacto">
      <ContactoForm />
    </Modal>
  );
}
