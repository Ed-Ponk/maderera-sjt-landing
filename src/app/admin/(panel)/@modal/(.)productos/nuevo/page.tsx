import { Modal } from "@/admin/ui/Modal";
import { ProductForm } from "@/admin/productos/ProductForm";
import { prisma } from "@/shared/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NuevoProductoModal() {
  const [categorias, sedes] = await Promise.all([
    prisma.categoria.findMany({
      orderBy: { orden: "asc" },
      select: { id: true, nombre: true },
    }),
    prisma.sede.findMany({
      where: { activa: true },
      select: { id: true, nombre: true, slug: true, esProximamente: true },
      orderBy: { nombre: "asc" },
    }),
  ]);

  return (
    <Modal title="Nuevo producto">
      <ProductForm categorias={categorias} sedes={sedes} />
    </Modal>
  );
}
