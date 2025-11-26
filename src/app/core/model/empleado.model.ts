
export interface Empleado {
  id: number;
  nombre: string;
  dni: string;
  puestos: string[];       // puede tener varios puestos
  cobraPorHora: boolean;
  cobraPorDia: boolean;
  activo: boolean;
}