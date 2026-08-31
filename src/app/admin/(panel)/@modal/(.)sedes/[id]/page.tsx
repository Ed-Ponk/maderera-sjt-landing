import { Modal } from "@/admin/ui/Modal";
import { SedeEditContent } from "@/admin/sedes/SedeEditContent";

export const dynamic = "force-dynamic";

export default async function EditarSedeModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal title="Editar sede">
      <SedeEditContent id={id} />
    </Modal>
  );
}
