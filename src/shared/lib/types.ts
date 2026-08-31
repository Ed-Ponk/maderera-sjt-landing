export type TipoProducto = "MADERA_TABLON" | "TABLERO_PROCESADO" | "ACABADO";

export type EstadoDisponibilidad = "DISPONIBLE" | "A_PEDIDO" | "NO_DISPONIBLE";

export interface SedeOption {
  id: string;
  nombre: string;
  slug: string;
  esProximamente: boolean;
}

export interface ActiveSedeInfo {
  nombre: string;
  esProximamente: boolean;
}
