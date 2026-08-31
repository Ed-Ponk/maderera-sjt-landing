import { Modal } from "@/admin/ui/Modal";
import { RedSocialEditContent } from "@/admin/redes/RedSocialEditContent";

export const dynamic = "force-dynamic";

export default async function EditarRedModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal title="Editar red social">
      <RedSocialEditContent id={id} />
    </Modal>
  );
}
