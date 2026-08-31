import { Modal } from "@/admin/ui/Modal";
import { UsuarioEditContent } from "@/admin/usuarios/UsuarioEditContent";

export const dynamic = "force-dynamic";

export default async function EditarUsuarioModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal title="Editar usuario">
      <UsuarioEditContent id={id} />
    </Modal>
  );
}
