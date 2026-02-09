import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type TipoPagoCargo = 'HORA' | 'DIA';

export interface TarifaCargo {
  id: number;
  cargo: string;
  tipoPago: TipoPagoCargo;
  montoPorHora: number;
  montoPorDia: number;
}

export interface TarifaCargoCreate {
  cargo: string;
  tipoPago: TipoPagoCargo;
  montoPorHora: number;
  montoPorDia: number;
}

@Injectable({
  providedIn: 'root'
})
export class SueldoService {
  private baseUrl = `${environment.apiUrl}/api/tarifas`;

  constructor(private http: HttpClient) {}

  getTarifas(): Observable<TarifaCargo[]> {
    return this.http.get<TarifaCargo[]>(this.baseUrl);
  }

  getTarifaByCargo(cargo: string): Observable<TarifaCargo> {
    return this.http.get<TarifaCargo>(`${this.baseUrl}/cargo/${cargo}`);
  }

  updateTarifa(tarifa: TarifaCargo): Observable<TarifaCargo> {
    return this.http.put<TarifaCargo>(`${this.baseUrl}/${tarifa.id}`, tarifa);
  }

  createTarifa(tarifa: TarifaCargoCreate): Observable<TarifaCargo> {
    return this.http.post<TarifaCargo>(this.baseUrl, tarifa);
  }

  deleteTarifa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
