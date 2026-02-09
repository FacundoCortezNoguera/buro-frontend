export interface Destinatario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
  recibeCierreNoche: boolean;
  recibeReportesMensuales: boolean;
  recibeCambiosEmpleados: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DestinatarioCreate {
  nombre: string;
  email: string;
  activo?: boolean;
  recibeCierreNoche?: boolean;
  recibeReportesMensuales?: boolean;
  recibeCambiosEmpleados?: boolean;
}
