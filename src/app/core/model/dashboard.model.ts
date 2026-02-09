export type Periodo = 'SEMANA' | 'MES' | 'AÑO';

export interface DashboardResumen {
  periodo: Periodo;
  fechaDesde: string;
  fechaHasta: string;

  // Financiero
  totalGastadoSueldos: number;
  totalPagado: number;
  totalPendiente: number;
  cantidadReportes: number;

  // Asistencias
  totalAsistencias: number;
  asistenciasPuntuales: number;
  asistenciasTarde: number;
  asistenciasTemprano: number;
  porcentajePuntualidad: number;

  // Empleados
  empleadosActivos: number;
  empleadosPorDia: number;
  empleadosPorHora: number;
}

export interface EmpleadoRanking {
  empleadoId: number;
  nombreCompleto: string;
  cargo: string;
  tipoPago: string;
  diasTrabajados: number;
  totalCobrado: number;
  asistenciasPuntuales: number;
  asistenciasTarde: number;
  porcentajePuntualidad: number;
  promedioMinutosDiferencia: number;
}

export type TipoAlerta = 'TARDANZAS_FRECUENTES' | 'AUSENCIAS' | 'BAJO_RENDIMIENTO';

export interface AlertaEmpleado {
  empleadoId: number;
  nombreCompleto: string;
  cargo: string;
  tipoAlerta: TipoAlerta;
  descripcion: string;
  valor: number;
  fechaUltimaIncidencia: string;
}

export interface DashboardComparativo {
  actual: DashboardResumen;
  anterior: DashboardResumen;
}
