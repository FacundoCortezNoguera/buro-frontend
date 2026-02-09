import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CambioEmpleado, CambioEmpleadoCreate } from '../model/cambio-empleado.model';

@Injectable({
  providedIn: 'root'
})
export class CambioEmpleadoService {
  private baseUrl = `${environment.apiUrl}/api/cambios`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CambioEmpleado[]> {
    return this.http.get<CambioEmpleado[]>(this.baseUrl);
  }

  getPendientes(): Observable<CambioEmpleado[]> {
    return this.http.get<CambioEmpleado[]>(`${this.baseUrl}/pendientes`);
  }

  getById(id: number): Observable<CambioEmpleado> {
    return this.http.get<CambioEmpleado>(`${this.baseUrl}/${id}`);
  }

  crear(cambio: CambioEmpleadoCreate): Observable<CambioEmpleado> {
    return this.http.post<CambioEmpleado>(this.baseUrl, cambio);
  }

  // Public endpoints (no auth needed)
  getByToken(token: string): Observable<CambioEmpleado> {
    return this.http.get<CambioEmpleado>(`${this.baseUrl}/aprobar/${token}`);
  }

  aprobar(token: string): Observable<CambioEmpleado> {
    return this.http.post<CambioEmpleado>(`${this.baseUrl}/aprobar/${token}`, {});
  }

  rechazar(token: string): Observable<CambioEmpleado> {
    return this.http.post<CambioEmpleado>(`${this.baseUrl}/rechazar/${token}`, {});
  }
}
