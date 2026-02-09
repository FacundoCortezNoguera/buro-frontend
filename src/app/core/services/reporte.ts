import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type TipoReporte = 'CIERRE_NOCHE' | 'RESUMEN_SEMANAL' | 'RESUMEN_MENSUAL';

export interface Reporte {
  id: number;
  tipo: TipoReporte;
  fechaReporte: string;
  titulo: string;
  descripcion: string;
  archivoNombre: string;
  totalMonto: number;
  cantidadEmpleados: number;
  enviado: boolean;
  emailDestino: string | null;
  fechaEnvio: string | null;
  createdAt: string;
}

export interface GastosPeriodo {
  totalGastos: number;
  cantidadReportes: number;
  desde: string;
  hasta: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private baseUrl = `${environment.apiUrl}/api/reportes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(this.baseUrl);
  }

  getByTipo(tipo: TipoReporte): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.baseUrl}/tipo/${tipo}`);
  }

  getByPeriodo(desde: string, hasta: string): Observable<Reporte[]> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    return this.http.get<Reporte[]>(`${this.baseUrl}/periodo`, { params });
  }

  getById(id: number): Observable<Reporte> {
    return this.http.get<Reporte>(`${this.baseUrl}/${id}`);
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
  }

  generarCierreNoche(fecha: string): Observable<Reporte> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.post<Reporte>(`${this.baseUrl}/cierre-noche`, null, { params });
  }

  /**
   * Genera el reporte semanal con formato de tabla por días.
   * Si desde/hasta no se especifican, usa desde el último reporte hasta hoy.
   */
  generarReporteSemanal(desde?: string, hasta?: string): Observable<Reporte> {
    let params = new HttpParams();
    if (desde) {
      params = params.set('desde', desde);
    }
    if (hasta) {
      params = params.set('hasta', hasta);
    }
    return this.http.post<Reporte>(`${this.baseUrl}/semanal`, null, { params });
  }

  /**
   * Genera el reporte para empleados que cobran por hora.
   * Si desde/hasta no se especifican, usa desde el último reporte de hora hasta hoy.
   */
  generarReporteHora(desde?: string, hasta?: string): Observable<Reporte> {
    let params = new HttpParams();
    if (desde) {
      params = params.set('desde', desde);
    }
    if (hasta) {
      params = params.set('hasta', hasta);
    }
    return this.http.post<Reporte>(`${this.baseUrl}/hora`, null, { params });
  }

  regenerarReporte(id: number): Observable<Reporte> {
    return this.http.post<Reporte>(`${this.baseUrl}/${id}/regenerar`, null);
  }

  enviarPorEmail(id: number, email?: string): Observable<Reporte> {
    let params = new HttpParams();
    if (email) {
      params = params.set('email', email);
    }
    return this.http.post<Reporte>(`${this.baseUrl}/${id}/enviar-email`, null, { params });
  }

  getGastosPeriodo(desde: string, hasta: string): Observable<GastosPeriodo> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    return this.http.get<GastosPeriodo>(`${this.baseUrl}/gastos-periodo`, { params });
  }

  getEmailConfigurado(): Observable<{ email: string }> {
    return this.http.get<{ email: string }>(`${this.baseUrl}/email-configurado`);
  }
}
