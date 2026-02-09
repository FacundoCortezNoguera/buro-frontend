export interface TurnoNoche {
  id: number;
  empleadoId: number;
  empleadoNombre?: string;
  empleadoCargo?: string;
  fecha: string;              // 'YYYY-MM-DD'
  horaEntrada?: string;       // 'HH:mm'
  horaSalida?: string;        // 'HH:mm'
  horasTrabajadas?: number;
  montoCalculado?: number;
  observaciones?: string;
}

export interface TurnoNocheCreate {
  empleadoId: number;
  horaEntrada?: string;
  horaSalida?: string;
  horasTrabajadas?: number;
  montoCalculado?: number;
  observaciones?: string;
}

export interface TurnoNocheBulk {
  fecha: string;
  turnos: TurnoNocheCreate[];
}

// Legacy interface for backwards compatibility
export interface TurnoNocheRegistro {
  id: number;
  empleadoId: number;
  fecha: string;
  cargoAsignado: string;
  horaEntrada?: string;
  retardoMin?: number;
  empezoEnCena?: boolean;
  estado: 'PENDIENTE' | 'OK' | 'TARDE' | 'AUSENTE';
}
