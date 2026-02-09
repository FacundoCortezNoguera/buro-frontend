export type TipoPago = 'HORA' | 'DIA';
export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

export interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  nombreCompleto?: string;
  documentoTipo?: string;
  documentoNumero: string;
  rolCode?: string;
  rolDescription?: string;
  tipoPago: TipoPago;
  activo: boolean;
  fechaAlta?: string;
  telefono?: string;
  cargo?: string;
  cobraPorHora?: number;
  cobraPorDia?: number;
  horasPorDia?: number;
  ajustePorcentaje?: number;  // Porcentaje adicional sobre el monto base
  ajusteMonto?: number;       // Monto fijo adicional
  diasTrabajo: DiaSemana[];
}

export interface EmpleadoCreate {
  nombre: string;
  apellido: string;
  documentoTipo?: string;
  documentoNumero: string;
  rolCode?: string;
  tipoPago: TipoPago;
  telefono?: string;
  cargo?: string;
  cobraPorHora?: number;
  cobraPorDia?: number;
  horasPorDia?: number;
  ajustePorcentaje?: number;
  ajusteMonto?: number;
  diasTrabajo?: DiaSemana[];
}
