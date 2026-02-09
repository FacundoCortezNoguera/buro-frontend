import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Rol, User } from '../../model/user.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  nombre: string;
  role: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private _user: User | null = null;
  private readonly isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadUserFromStorage();
  }

  get user(): User | null {
    return this._user;
  }

  get isLoggedIn(): boolean {
    return this._user != null;
  }

  get token(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  login(username: string, password: string): Observable<boolean> {
    console.log('Auth.login() llamado con:', username);
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          console.log('Respuesta del servidor:', response);
          if (this.isBrowser) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({
              username: response.username,
              nombre: response.nombre,
              rol: response.role
            }));
          }
          this._user = {
            username: response.username,
            rol: response.role as Rol
          };
          console.log('Usuario seteado:', this._user);
        }),
        map(() => {
          console.log('Retornando true');
          return true;
        }),
        catchError(error => {
          console.error('Login error:', error);
          return of(false);
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this._user = null;
  }

  private loadUserFromStorage(): void {
    if (!this.isBrowser) return;

    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userStr && token) {
      try {
        const userData = JSON.parse(userStr);
        this._user = {
          username: userData.username,
          rol: userData.rol as Rol
        };
      } catch {
        this.logout();
      }
    }
  }

  homeRoute(): string {
    if (!this._user) return '/login';

    switch (this._user.rol) {
      case 'ADMIN':
        return '/home-admin';
      case 'DUENO':
        return '/home-dueno';
      case 'RRHH':
        return '/home';
      case 'CAJA':
        return '/pagos';
      case 'SUPERVISOR':
        return '/turnos';
      default:
        return '/home';
    }
  }
}
