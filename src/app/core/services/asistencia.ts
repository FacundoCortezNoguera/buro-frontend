import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type EstadoAsistencia = 'TEMPRANO' | 'PUNTUAL' | 'TARDE';

export interface Asistencia {
  id: number;
  empleadoId: number;
  empleadoNombre: string;
  empleadoCargo: string;
  fecha: string;
  horaLlegada: string;
  horaEsperada: string;
  minutosDiferencia: number;
  estado: EstadoAsistencia;
  registradoPor: string;
  observaciones: string;
}

export interface MarcarPresenteRequest {
  empleadoId: number;
  horaLlegada: string;
  horaEsperada?: string;
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private baseUrl = `${environment.apiUrl}/api/asistencias`;

  constructor(private http: HttpClient) {}

  marcarPresente(request: MarcarPresenteRequest): Observable<Asistencia> {
    return this.http.post<Asistencia>(`${this.baseUrl}/marcar-presente`, request);
  }

  getAsistenciasHoy(): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.baseUrl}/hoy`);
  }

  getAsistenciasByFecha(fecha: string): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.baseUrl}/fecha/${fecha}`);
  }

  getAsistenciaEmpleadoHoy(empleadoId: number): Observable<Asistencia> {
    return this.http.get<Asistencia>(`${this.baseUrl}/empleado/${empleadoId}/hoy`);
  }

  getHistorialEmpleado(empleadoId: number): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.baseUrl}/empleado/${empleadoId}/historial`);
  }

  actualizarAsistencia(id: number, horaLlegada: string, observaciones?: string): Observable<Asistencia> {
    return this.http.put<Asistencia>(`${this.baseUrl}/${id}`, { horaLlegada, observaciones });
  }

  eliminarAsistencia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
