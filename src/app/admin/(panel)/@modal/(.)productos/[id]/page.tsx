import { Modal } from "@/admin/ui/Modal";
import { ProductoEditContent } from "@/admin/productos/ProductoEditContent";

export const dynamic = "force-dynamic";

export default async function EditarProductoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Modal title="Editar producto">
      <ProductoEditContent id={id} />
    </Modal>
  );
}
