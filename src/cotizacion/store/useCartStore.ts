import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/cotizacion/lib/whatsapp";

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  removeItem: (productoId: string) => void;
  updateQuantity: (productoId: string, cantidad: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem, cantidad = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productoId === newItem.productoId
          );
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].cantidad += cantidad;
            return { items: updated };
          }
          return {
            items: [
              ...state.items,
              {
                productoId: newItem.productoId,
                productoNombre: newItem.productoNombre,
                medidasDisplay: newItem.medidasDisplay,
                cantidad,
              },
            ],
          };
        });
      },
      removeItem: (productoId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productoId !== productoId),
        }));
      },
      updateQuantity: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(productoId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productoId === productoId ? { ...i, cantidad } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.cantidad, 0);
      },
    }),
    {
      name: "maderera-sjt-cart",
    }
  )
);
