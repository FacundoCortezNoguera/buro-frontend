import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Toolbar } from '../../../shared/toolbar/toolbar';
import { DestinatarioService } from '../../../core/services/destinatario';
import { Destinatario, DestinatarioCreate } from '../../../core/model/destinatario.model';

@Component({
  selector: 'app-destinatarios',
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
    MatSnackBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './destinatarios.html',
  styleUrl: './destinatarios.scss',
})
export class Destinatarios implements OnInit {
  destinatarios: Destinatario[] = [];
  loading = false;
  saving = false;
  showForm = false;
  editingId: number | null = null;

  nuevoDestinatario: DestinatarioCreate = {
    nombre: '',
    email: '',
    recibeCierreNoche: true,
    recibeReportesMensuales: false,
    recibeCambiosEmpleados: false,
  };

  displayedColumns = ['nombre', 'email', 'cierreNoche', 'mensuales', 'cambios', 'activo', 'acciones'];

  constructor(
    private destinatarioService: DestinatarioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.destinatarioService.getAll().subscribe({
      next: (data) => {
        this.destinatarios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando destinatarios:', err);
        this.snackBar.open('Error al cargar destinatarios', 'Cerrar', { duration: 3000 });
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
    this.editingId = null;
    this.nuevoDestinatario = {
      nombre: '',
      email: '',
      recibeCierreNoche: true,
      recibeReportesMensuales: false,
      recibeCambiosEmpleados: false,
    };
  }

  guardar(): void {
    if (!this.nuevoDestinatario.nombre || !this.nuevoDestinatario.email) {
      this.snackBar.open('Nombre y email son obligatorios', 'Cerrar', { duration: 2500 });
      return;
    }

    this.saving = true;

    if (this.editingId) {
      this.destinatarioService.actualizar(this.editingId, this.nuevoDestinatario).subscribe({
        next: () => {
          this.snackBar.open('Destinatario actualizado', 'Cerrar', { duration: 2000 });
          this.saving = false;
          this.showForm = false;
          this.resetForm();
          this.cargar();
        },
        error: (err) => {
          console.error('Error actualizando destinatario:', err);
          this.snackBar.open('Error al actualizar destinatario', 'Cerrar', { duration: 3000 });
          this.saving = false;
        }
      });
    } else {
      this.destinatarioService.crear(this.nuevoDestinatario).subscribe({
        next: () => {
          this.snackBar.open('Destinatario creado', 'Cerrar', { duration: 2000 });
          this.saving = false;
          this.showForm = false;
          this.resetForm();
          this.cargar();
        },
        error: (err) => {
          console.error('Error creando destinatario:', err);
          const msg = err.error?.message || 'Error al crear destinatario';
          this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
          this.saving = false;
        }
      });
    }
  }

  editar(dest: Destinatario): void {
    this.editingId = dest.id;
    this.nuevoDestinatario = {
      nombre: dest.nombre,
      email: dest.email,
      recibeCierreNoche: dest.recibeCierreNoche,
      recibeReportesMensuales: dest.recibeReportesMensuales,
      recibeCambiosEmpleados: dest.recibeCambiosEmpleados,
    };
    this.showForm = true;
  }

  toggleActivo(dest: Destinatario): void {
    this.destinatarioService.toggleActivo(dest.id).subscribe({
      next: (updated) => {
        dest.activo = updated.activo;
        const estado = dest.activo ? 'activado' : 'desactivado';
        this.snackBar.open(`Destinatario ${estado}`, 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error actualizando destinatario:', err);
        this.snackBar.open('Error al actualizar estado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  toggleSuscripcion(dest: Destinatario, campo: 'recibeCierreNoche' | 'recibeReportesMensuales' | 'recibeCambiosEmpleados'): void {
    const update: DestinatarioCreate = {
      nombre: dest.nombre,
      email: dest.email,
      recibeCierreNoche: dest.recibeCierreNoche,
      recibeReportesMensuales: dest.recibeReportesMensuales,
      recibeCambiosEmpleados: dest.recibeCambiosEmpleados,
    };
    update[campo] = !dest[campo];

    this.destinatarioService.actualizar(dest.id, update).subscribe({
      next: (updated) => {
        dest.recibeCierreNoche = updated.recibeCierreNoche;
        dest.recibeReportesMensuales = updated.recibeReportesMensuales;
        dest.recibeCambiosEmpleados = updated.recibeCambiosEmpleados;
      },
      error: (err) => {
        console.error('Error actualizando suscripción:', err);
        this.snackBar.open('Error al actualizar suscripción', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminar(dest: Destinatario): void {
    if (!confirm(`Eliminar a ${dest.nombre} (${dest.email})?`)) return;

    this.destinatarioService.eliminar(dest.id).subscribe({
      next: () => {
        this.snackBar.open('Destinatario eliminado', 'Cerrar', { duration: 2000 });
        this.cargar();
      },
      error: (err) => {
        console.error('Error eliminando destinatario:', err);
        this.snackBar.open('Error al eliminar destinatario', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
