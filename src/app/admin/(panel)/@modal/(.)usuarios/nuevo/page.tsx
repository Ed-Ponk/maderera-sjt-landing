import { Modal } from "@/admin/ui/Modal";
import { UserForm } from "@/admin/usuarios/UserForm";

export const dynamic = "force-dynamic";

export default function NuevoUsuarioModal() {
  return (
    <Modal title="Nuevo usuario">
      <UserForm />
    </Modal>
  );
}
