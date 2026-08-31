import { Modal } from "@/admin/ui/Modal";
import { SedeForm } from "@/admin/sedes/SedeForm";

export const dynamic = "force-dynamic";

export default function NuevaSedeModal() {
  return (
    <Modal title="Nueva sede">
      <SedeForm />
    </Modal>
  );
}
