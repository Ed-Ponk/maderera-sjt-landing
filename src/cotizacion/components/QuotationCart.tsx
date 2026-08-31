"use client";

import { useMemo, useState } from "react";
import { useCartStore } from "@/cotizacion/store/useCartStore";
import { useSedeStore } from "@/sedes/store/useSedeStore";
import {
  generateWhatsAppLink,
  formatWhatsAppNumber,
  WHATSAPP_NUMBERS,
} from "@/cotizacion/lib/whatsapp";
import { ActiveSedeInfo } from "@/shared/lib/types";
import { ShoppingBag, X, Plus, Minus, Trash2, Send } from "lucide-react";

interface QuotationCartProps {
  sedes: ActiveSedeInfo[];
  contactos: { nombre: string; whatsapp: string }[];
}

export function QuotationCart({ sedes, contactos }: QuotationCartProps) {
  const [isOpen, setIsOpen] = useState(false);

  const recipientOptions = useMemo(() => {
    if (contactos.length > 0) {
      return contactos.map((c) => ({
        number: c.whatsapp.replace(/\D/g, ""),
        label: `${c.nombre} — ${formatWhatsAppNumber(c.whatsapp)}`,
      }));
    }
    return WHATSAPP_NUMBERS.map((n) => ({
      number: n,
      label: formatWhatsAppNumber(n),
    }));
  }, [contactos]);

  const [selectedNumber, setSelectedNumber] = useState(
    () => recipientOptions[0]?.number ?? ""
  );
  const { items, updateQuantity, removeItem, clearCart, getTotalItems } =
    useCartStore();
  const { activeSedeSlug } = useSedeStore();

  const totalItems = getTotalItems();

  // Encontrar la información de la sede activa
  const activeSede =
    sedes.find((s) => s.nombre.toLowerCase() === activeSedeSlug.toLowerCase()) ||
    sedes[0] || { nombre: "Talara", esProximamente: false };

  const whatsappUrl = generateWhatsAppLink(activeSede, items, selectedNumber);

  return (
    <>
      {/* Header Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative border-2 border-accent-deep text-accent-deep hover:bg-secondary hover:text-on-secondary font-display text-lg uppercase tracking-wide py-1.5 px-4 transition-colors flex items-center gap-2 cursor-pointer active:scale-[0.99]"
        aria-label="Ver carrito de cotización"
      >
        <ShoppingBag className="w-4 h-4" strokeWidth={2} />
        <span className="hidden sm:inline">Cotización</span>
        {totalItems > 0 && (
          <span className="bg-primary text-on-primary font-mono text-xs font-bold w-5 h-5 flex items-center justify-center -mr-1">
            {totalItems}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-primary/60">
          <div className="w-full max-w-md bg-surface-container-lowest border-l-2 border-outline-variant h-full flex flex-col shadow-plate-lg">
            {/* Drawer Header — El ticket */}
            <div className="p-5 bg-primary text-on-primary flex justify-between items-start gap-4">
              <div>
                <h2 className="font-display text-3xl uppercase tracking-wide text-on-primary">
                  Ticket de Corte
                </h2>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-on-primary-container">
                  Sede: {activeSede.nombre}
                  {activeSede.esProximamente ? " — Próximamente" : ""}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-on-primary-container hover:text-on-primary transition-colors"
                aria-label="Cerrar cotizador"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item List */}
            <div className="flex-grow p-5 overflow-y-auto flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="py-14 text-center flex flex-col items-center justify-center gap-3 text-on-surface-variant">
                  <ShoppingBag className="w-12 h-12 stroke-1 text-outline" />
                  <p className="text-sm font-medium">No has agregado productos a tu cotización.</p>
                  <p className="font-mono text-xs text-outline">
                    Explora el catálogo y haz clic en "Cotizar ahora".
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.productoId}
                    className="bg-surface-container-lowest border-2 border-outline-variant p-4 flex flex-col gap-3 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-grow">
                        <h4 className="font-display text-lg uppercase tracking-wide text-on-surface leading-tight">
                          {item.productoNombre}
                        </h4>
                        {item.medidasDisplay && (
                          <p className="mt-1 font-mono text-xs uppercase text-on-surface-variant">
                            {item.medidasDisplay}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.productoId)}
                        className="text-error hover:bg-error-container/40 p-1 transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 border-t border-outline-variant pt-3">
                      <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mr-auto">
                        Cantidad
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productoId, item.cantidad - 1)}
                        className="w-8 h-8 border-2 border-outline-variant hover:border-secondary text-on-surface flex items-center justify-center transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-sm font-bold w-8 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
                        className="w-8 h-8 border-2 border-outline-variant hover:border-secondary text-on-surface flex items-center justify-center transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && (
              <div className="p-5 bg-surface-container-lowest border-t-2 border-primary flex flex-col gap-3">
                <div className="flex justify-between items-center font-mono text-xs text-on-surface-variant">
                  <span>Total de ítems: {totalItems}</span>
                  <button
                    onClick={clearCart}
                    className="text-error hover:underline"
                  >
                    Vaciar cotizador
                  </button>
                </div>

                {recipientOptions.length > 1 && (
                  <label className="flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
                    <span>Enviar a:</span>
                    <select
                      value={selectedNumber}
                      onChange={(e) => setSelectedNumber(e.target.value)}
                      className="border-2 border-outline-variant bg-surface-container-lowest text-on-surface font-mono text-sm normal-case tracking-normal px-2 py-1 cursor-pointer"
                      aria-label="Número de WhatsApp para la cotización"
                    >
                      {recipientOptions.map((o) => (
                        <option key={o.number} value={o.number}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {selectedNumber && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      clearCart();
                      setIsOpen(false);
                    }}
                    className="w-full bg-secondary hover:brightness-95 text-on-secondary font-display text-xl uppercase tracking-wide py-4 px-4 shadow-plate transition-[filter] flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <Send className="w-5 h-5" strokeWidth={2} />
                    <span>Enviar por WhatsApp</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
