import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Configuracion {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private baseUrl = `${environment.apiUrl}/api/configuracion`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Configuracion> {
    return this.http.get<Configuracion>(this.baseUrl);
  }

  get(clave: string): Observable<{ clave: string; valor: string }> {
    return this.http.get<{ clave: string; valor: string }>(`${this.baseUrl}/${clave}`);
  }

  update(clave: string, valor: string): Observable<{ clave: string; valor: string }> {
    return this.http.put<{ clave: string; valor: string }>(`${this.baseUrl}/${clave}`, { valor });
  }

  // Métodos específicos
  getEmailReportes(): Observable<{ email: string }> {
    return this.http.get<{ email: string }>(`${this.baseUrl}/email-reportes`);
  }

  setEmailReportes(email: string): Observable<{ email: string; mensaje: string }> {
    return this.http.put<{ email: string; mensaje: string }>(`${this.baseUrl}/email-reportes`, { email });
  }

  getNombreNegocio(): Observable<{ nombre: string }> {
    return this.http.get<{ nombre: string }>(`${this.baseUrl}/nombre-negocio`);
  }

  setNombreNegocio(nombre: string): Observable<{ nombre: string; mensaje: string }> {
    return this.http.put<{ nombre: string; mensaje: string }>(`${this.baseUrl}/nombre-negocio`, { nombre });
  }
}
