import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Destinatario, DestinatarioCreate } from '../model/destinatario.model';

@Injectable({
  providedIn: 'root'
})
export class DestinatarioService {
  private baseUrl = `${environment.apiUrl}/api/destinatarios-notificacion`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Destinatario[]> {
    return this.http.get<Destinatario[]>(this.baseUrl);
  }

  getById(id: number): Observable<Destinatario> {
    return this.http.get<Destinatario>(`${this.baseUrl}/${id}`);
  }

  crear(destinatario: DestinatarioCreate): Observable<Destinatario> {
    return this.http.post<Destinatario>(this.baseUrl, destinatario);
  }

  actualizar(id: number, destinatario: DestinatarioCreate): Observable<Destinatario> {
    return this.http.put<Destinatario>(`${this.baseUrl}/${id}`, destinatario);
  }

  toggleActivo(id: number): Observable<Destinatario> {
    return this.http.patch<Destinatario>(`${this.baseUrl}/${id}/toggle-activo`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
