export interface PagoDiario {
  id: number;
  empleadoId: number;
  empleadoNombre?: string;
  empleadoCargo?: string;
  fecha: string;           // 'YYYY-MM-DD'
  concepto: string;
  monto: number;
  pagado: boolean;
  fechaPago?: string;
  turnoNocheId?: number;
  observaciones?: string;
}

export interface CalcularSalarioRequest {
  desde: string;
  hasta: string;
  empleadoIds?: number[];
}

export interface CalcularSalarioResponse {
  pagosCreados: number;
  pagosActualizados: number;
  totalMonto: number;
  pagos: PagoDiario[];
}

export interface EnviarEmailRequest {
  fecha: string;
  destinatario?: string;
  asunto?: string;
}

// Resumen de pagos
export interface ResumenPagos {
  fechaDesde: string;
  fechaHasta: string;
  totalPeriodo: number;
  totalPendienteAnterior: number;
  totalGeneral: number;
  empleados: EmpleadoPagoResumen[];
}

export interface EmpleadoPagoResumen {
  empleadoId: number;
  empleadoNombre: string;
  cargo: string;
  tipoPago: 'HORA' | 'DIA';
  totalPeriodo: number;
  totalPendienteAnterior: number;
  totalACobrar: number;
  diasTrabajados: number;
  diasPendientesAnteriores: number;
  diasPeriodo: PagoDiaDetalle[];
  extras: ExtraPago[];
}

export interface PagoDiaDetalle {
  pagoId: number | null;
  fecha: string;
  montoBase: number;
  montoExtras: number;
  montoTotal: number;
  pagado: boolean;
  horaLlegada: string;
  estado: string;
}

export interface ExtraPago {
  tipo: string;
  descripcion: string;
  monto: number;
  fecha: string;
}
