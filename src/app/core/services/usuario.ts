import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  role: string;
  enabled: boolean;
}

export interface UsuarioCreate {
  username: string;
  password: string;
  nombre: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = `${environment.apiUrl}/api/usuarios`;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  createUsuario(usuario: UsuarioCreate): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario);
  }

  toggleEnabled(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.baseUrl}/${id}/toggle-enabled`, {});
  }

  resetPassword(id: number, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/reset-password`, { newPassword });
  }
}
