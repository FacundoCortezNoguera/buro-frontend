import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardResumen,
  EmpleadoRanking,
  AlertaEmpleado,
  DashboardComparativo,
  Periodo
} from '../model/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el resumen del dashboard para un período dado
   */
  getResumen(periodo: Periodo = 'SEMANA'): Observable<DashboardResumen> {
    const params = new HttpParams().set('periodo', periodo);
    return this.http.get<DashboardResumen>(`${this.apiUrl}/resumen`, { params });
  }

  /**
   * Obtiene el ranking de empleados por puntualidad
   */
  getRankingPuntualidad(limit: number = 10, desde?: string, hasta?: string): Observable<EmpleadoRanking[]> {
    let params = new HttpParams().set('limit', limit.toString());
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return this.http.get<EmpleadoRanking[]>(`${this.apiUrl}/ranking/puntualidad`, { params });
  }

  /**
   * Obtiene el ranking de empleados con más tardanzas
   */
  getRankingTardanzas(limit: number = 10, desde?: string, hasta?: string): Observable<EmpleadoRanking[]> {
    let params = new HttpParams().set('limit', limit.toString());
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return this.http.get<EmpleadoRanking[]>(`${this.apiUrl}/ranking/tardanzas`, { params });
  }

  /**
   * Obtiene el ranking de empleados por días trabajados
   */
  getRankingDiasTrabajados(limit: number = 10, desde?: string, hasta?: string): Observable<EmpleadoRanking[]> {
    let params = new HttpParams().set('limit', limit.toString());
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return this.http.get<EmpleadoRanking[]>(`${this.apiUrl}/ranking/dias-trabajados`, { params });
  }

  /**
   * Obtiene las alertas de empleados problemáticos
   */
  getAlertas(desde?: string, hasta?: string): Observable<AlertaEmpleado[]> {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return this.http.get<AlertaEmpleado[]>(`${this.apiUrl}/alertas`, { params });
  }

  /**
   * Obtiene el comparativo entre el período actual y el anterior
   */
  getComparativo(periodo: Periodo = 'SEMANA'): Observable<DashboardComparativo> {
    const params = new HttpParams().set('periodo', periodo);
    return this.http.get<DashboardComparativo>(`${this.apiUrl}/comparativo`, { params });
  }
}
