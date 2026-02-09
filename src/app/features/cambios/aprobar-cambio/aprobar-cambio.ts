import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CambioEmpleadoService } from '../../../core/services/cambio-empleado';
import { CambioEmpleado } from '../../../core/model/cambio-empleado.model';

@Component({
  selector: 'app-aprobar-cambio',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './aprobar-cambio.html',
  styleUrl: './aprobar-cambio.scss',
})
export class AprobarCambio implements OnInit {
  cambio: CambioEmpleado | null = null;
  loading = true;
  processing = false;
  error: string | null = null;
  resultado: 'aprobado' | 'rechazado' | null = null;

  private token = '';

  constructor(
    private route: ActivatedRoute,
    private cambioService: CambioEmpleadoService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    if (!this.token) {
      this.error = 'Token no válido';
      this.loading = false;
      return;
    }
    this.cargarCambio();
  }

  cargarCambio(): void {
    this.cambioService.getByToken(this.token).subscribe({
      next: (cambio) => {
        this.cambio = cambio;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando cambio:', err);
        if (err.status === 404) {
          this.error = 'El enlace no es válido o ya expiró';
        } else {
          this.error = 'Error al cargar los detalles del cambio';
        }
        this.loading = false;
      }
    });
  }

  aprobar(): void {
    if (!confirm('¿Estás seguro de que querés aprobar este cambio?')) return;

    this.processing = true;
    this.cambioService.aprobar(this.token).subscribe({
      next: (cambio) => {
        this.cambio = cambio;
        this.resultado = 'aprobado';
        this.processing = false;
      },
      error: (err) => {
        console.error('Error aprobando cambio:', err);
        this.error = err.error?.message || 'Error al aprobar el cambio';
        this.processing = false;
      }
    });
  }

  rechazar(): void {
    if (!confirm('¿Estás seguro de que querés rechazar este cambio?')) return;

    this.processing = true;
    this.cambioService.rechazar(this.token).subscribe({
      next: (cambio) => {
        this.cambio = cambio;
        this.resultado = 'rechazado';
        this.processing = false;
      },
      error: (err) => {
        console.error('Error rechazando cambio:', err);
        this.error = err.error?.message || 'Error al rechazar el cambio';
        this.processing = false;
      }
    });
  }

  getTipoCambioLabel(tipo: string): string {
    switch (tipo) {
      case 'CAMBIO_CARGO': return 'Cambio de Cargo';
      case 'AUMENTO_SUELDO': return 'Aumento de Sueldo';
      case 'CAMBIO_TARIFA': return 'Cambio de Tarifa';
      default: return tipo;
    }
  }

  get yaResuelto(): boolean {
    return this.cambio?.estado !== 'PENDIENTE';
  }
}
