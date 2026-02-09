import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

import { Toolbar } from '../../../shared/toolbar/toolbar';
import { SueldoService, TarifaCargo, TarifaCargoCreate, TipoPagoCargo } from '../../../core/services/sueldo';

@Component({
  selector: 'app-sueldos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Toolbar,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './sueldos.html',
  styleUrl: './sueldos.scss',
})
export class Sueldos implements OnInit {
  tarifas: TarifaCargo[] = [];
  loading = false;
  saving = false;
  showForm = false;

  nuevoCargo: TarifaCargoCreate = {
    cargo: '',
    tipoPago: 'DIA',
    montoPorHora: 0,
    montoPorDia: 0
  };

  editingId: number | null = null;

  displayedColumns = ['cargo', 'tipoPago', 'monto', 'acciones'];

  constructor(
    private sueldoService: SueldoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.sueldoService.getTarifas().subscribe({
      next: (tarifas) => {
        this.tarifas = tarifas;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando tarifas:', err);
        this.snackBar.open('Error al cargar cargos', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.nuevoCargo = {
      cargo: '',
      tipoPago: 'DIA',
      montoPorHora: 0,
      montoPorDia: 0
    };
    this.editingId = null;
  }

  editarCargo(tarifa: TarifaCargo): void {
    this.editingId = tarifa.id;
    this.nuevoCargo = {
      cargo: tarifa.cargo,
      tipoPago: tarifa.tipoPago,
      montoPorHora: tarifa.montoPorHora,
      montoPorDia: tarifa.montoPorDia
    };
    this.showForm = true;
  }

  guardar(): void {
    if (!this.nuevoCargo.cargo) {
      this.snackBar.open('Ingresá el nombre del cargo', 'Cerrar', { duration: 2500 });
      return;
    }

    this.saving = true;

    if (this.editingId) {
      const tarifa: TarifaCargo = {
        id: this.editingId,
        ...this.nuevoCargo
      };
      this.sueldoService.updateTarifa(tarifa).subscribe({
        next: () => {
          this.snackBar.open('Cargo actualizado', 'Cerrar', { duration: 2000 });
          this.saving = false;
          this.showForm = false;
          this.resetForm();
          this.cargar();
        },
        error: (err) => {
          console.error('Error actualizando cargo:', err);
          this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
          this.saving = false;
        }
      });
    } else {
      this.sueldoService.createTarifa(this.nuevoCargo).subscribe({
        next: () => {
          this.snackBar.open('Cargo creado', 'Cerrar', { duration: 2000 });
          this.saving = false;
          this.showForm = false;
          this.resetForm();
          this.cargar();
        },
        error: (err) => {
          console.error('Error creando cargo:', err);
          this.snackBar.open('Error al crear cargo', 'Cerrar', { duration: 3000 });
          this.saving = false;
        }
      });
    }
  }

  eliminar(tarifa: TarifaCargo): void {
    if (!confirm(`¿Eliminar el cargo "${tarifa.cargo}"?`)) {
      return;
    }

    this.sueldoService.deleteTarifa(tarifa.id).subscribe({
      next: () => {
        this.snackBar.open('Cargo eliminado', 'Cerrar', { duration: 2000 });
        this.cargar();
      },
      error: (err) => {
        console.error('Error eliminando cargo:', err);
        this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getMonto(tarifa: TarifaCargo): string {
    if (tarifa.tipoPago === 'HORA') {
      return `$${tarifa.montoPorHora?.toLocaleString('es-AR') || 0} /hora`;
    }
    return `$${tarifa.montoPorDia?.toLocaleString('es-AR') || 0} /día`;
  }

  getTipoPagoLabel(tipo: TipoPagoCargo): string {
    return tipo === 'HORA' ? 'Por hora' : 'Por día';
  }
}
