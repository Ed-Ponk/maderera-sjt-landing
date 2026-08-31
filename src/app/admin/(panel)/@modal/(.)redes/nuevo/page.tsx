import { Modal } from "@/admin/ui/Modal";
import { RedSocialForm } from "@/admin/redes/RedSocialForm";

export const dynamic = "force-dynamic";

export default function NuevaRedModal() {
  return (
    <Modal title="Nueva red social">
      <RedSocialForm />
    </Modal>
  );
}
