import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

import { Toolbar } from '../../../shared/toolbar/toolbar';
import { CambioEmpleadoService } from '../../../core/services/cambio-empleado';
import { CambioEmpleado } from '../../../core/model/cambio-empleado.model';

@Component({
  selector: 'app-cambios',
  standalone: true,
  imports: [
    CommonModule,
    Toolbar,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTabsModule,
  ],
  templateUrl: './cambios.html',
  styleUrl: './cambios.scss',
})
export class Cambios implements OnInit {
  cambios: CambioEmpleado[] = [];
  pendientes: CambioEmpleado[] = [];
  loading = false;
  selectedTab = 0;

  displayedColumns = ['empleado', 'tipoCambio', 'cambio', 'estado', 'solicitadoPor', 'fecha'];

  constructor(
    private cambioService: CambioEmpleadoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.cambioService.getAll().subscribe({
      next: (data) => {
        this.cambios = data;
        this.pendientes = data.filter(c => c.estado === 'PENDIENTE');
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando cambios:', err);
        this.snackBar.open('Error al cargar cambios', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  get dataActual(): CambioEmpleado[] {
    return this.selectedTab === 0 ? this.pendientes : this.cambios;
  }

  getTipoCambioLabel(tipo: string): string {
    switch (tipo) {
      case 'CAMBIO_CARGO': return 'Cambio de Cargo';
      case 'AUMENTO_SUELDO': return 'Aumento de Sueldo';
      case 'CAMBIO_TARIFA': return 'Cambio de Tarifa';
      default: return tipo;
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'ACEPTADO': return 'estado-aceptado';
      case 'RECHAZADO': return 'estado-rechazado';
      case 'EXPIRADO': return 'estado-expirado';
      default: return '';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'ACEPTADO': return 'Aprobado';
      case 'RECHAZADO': return 'Rechazado';
      case 'EXPIRADO': return 'Expirado';
      default: return estado;
    }
  }
}
