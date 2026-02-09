export type TipoCambio = 'CAMBIO_CARGO' | 'AUMENTO_SUELDO' | 'CAMBIO_TARIFA';
export type EstadoCambio = 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'EXPIRADO';

export interface CambioEmpleado {
  id: number;
  empleadoId: number;
  empleadoNombre: string;
  tipoCambio: TipoCambio;
  campoModificado: string;
  valorAnterior: string;
  valorNuevo: string;
  descripcion: string;
  estado: EstadoCambio;
  solicitadoPor: string;
  aprobadoPor: string;
  fechaAprobacion: string;
  createdAt: string;
}

export interface CambioEmpleadoCreate {
  empleadoId: number;
  tipoCambio: TipoCambio;
  campoModificado: string;
  valorAnterior?: string;
  valorNuevo: string;
  descripcion?: string;
}
