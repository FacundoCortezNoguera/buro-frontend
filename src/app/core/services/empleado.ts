import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Empleado, EmpleadoCreate } from '../model/empleado.model';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private readonly apiUrl = `${environment.apiUrl}/api/empleados`;

  constructor(private http: HttpClient) {}

  getEmpleados(soloActivos: boolean = false): Observable<Empleado[]> {
    const params = new HttpParams().set('soloActivos', soloActivos.toString());
    return this.http.get<Empleado[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }

  agregar(empleado: EmpleadoCreate): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado);
  }

  update(id: number, empleado: EmpleadoCreate): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/${id}`, empleado);
  }

  toggleActivo(id: number): Observable<Empleado> {
    return this.http.patch<Empleado>(`${this.apiUrl}/${id}/toggle-activo`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
