import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TurnoNoche, TurnoNocheBulk, TurnoNocheCreate } from '../model/turno-noche.model';

@Injectable({
  providedIn: 'root',
})
export class TurnoNocheService {
  private readonly apiUrl = `${environment.apiUrl}/api/turnos-noche`;

  constructor(private http: HttpClient) {}

  getByFecha(fecha: string): Observable<TurnoNoche[]> {
    return this.http.get<TurnoNoche[]>(`${this.apiUrl}/${fecha}`);
  }

  getByFechaRange(desde: string, hasta: string): Observable<TurnoNoche[]> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);
    return this.http.get<TurnoNoche[]>(this.apiUrl, { params });
  }

  saveTurnos(fecha: string, turnos: TurnoNocheCreate[]): Observable<TurnoNoche[]> {
    const body: TurnoNocheBulk = { fecha, turnos };
    return this.http.post<TurnoNoche[]>(`${this.apiUrl}/${fecha}`, body);
  }
}
