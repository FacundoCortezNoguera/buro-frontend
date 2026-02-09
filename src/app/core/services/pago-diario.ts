import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PagoDiario,
  CalcularSalarioRequest,
  CalcularSalarioResponse,
  EnviarEmailRequest,
  ResumenPagos
} from '../model/pago-diario.model';

@Injectable({
  providedIn: 'root',
})
export class PagoDiarioService {
  private readonly apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getByFechaRange(desde: string, hasta: string): Observable<PagoDiario[]> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    return this.http.get<PagoDiario[]>(`${this.apiUrl}/pagos-diarios`, { params });
  }

  getPendientes(): Observable<PagoDiario[]> {
    return this.http.get<PagoDiario[]>(`${this.apiUrl}/pagos-diarios/pendientes`);
  }

  marcarPagado(id: number): Observable<PagoDiario> {
    return this.http.put<PagoDiario>(`${this.apiUrl}/pagos-diarios/${id}/marcar-pagado`, {});
  }

  marcarNoPagado(id: number): Observable<PagoDiario> {
    return this.http.put<PagoDiario>(`${this.apiUrl}/pagos-diarios/${id}/marcar-no-pagado`, {});
  }

  calcularSalarios(request: CalcularSalarioRequest): Observable<CalcularSalarioResponse> {
    return this.http.post<CalcularSalarioResponse>(`${this.apiUrl}/pagos-diarios/calcular-salario`, request);
  }

  enviarEmailCierreNoche(request: EnviarEmailRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/cierre-noche/enviar-email`, request);
  }

  getResumenPagosDia(): Observable<ResumenPagos> {
    return this.http.get<ResumenPagos>(`${this.apiUrl}/pagos-diarios/resumen-dia`);
  }

  getResumenPagosHora(): Observable<ResumenPagos> {
    return this.http.get<ResumenPagos>(`${this.apiUrl}/pagos-diarios/resumen-hora`);
  }

  marcarEmpleadoPagado(empleadoId: number, desde: string, hasta: string): Observable<{ message: string }> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/pagos-diarios/empleado/${empleadoId}/marcar-pagado`,
      {},
      { params }
    );
  }
}
