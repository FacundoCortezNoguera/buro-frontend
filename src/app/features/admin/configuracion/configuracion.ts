import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Toolbar } from '../../../shared/toolbar/toolbar';
import { ConfiguracionService } from '../../../core/services/configuracion';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    Toolbar,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss',
})
export class Configuracion implements OnInit {
  loading = false;
  saving = false;

  nombreNegocio = '';

  constructor(
    private configuracionService: ConfiguracionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarConfiguracion();
  }

  cargarConfiguracion(): void {
    this.loading = true;

    this.configuracionService.getNombreNegocio().subscribe({
      next: (res) => {
        this.nombreNegocio = res.nombre || 'BURO';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando nombre:', err);
        this.loading = false;
      }
    });
  }

  guardarNombre(): void {
    if (!this.nombreNegocio.trim()) {
      this.snackBar.open('El nombre no puede estar vacío', 'Cerrar', { duration: 2500 });
      return;
    }

    this.saving = true;
    this.configuracionService.setNombreNegocio(this.nombreNegocio).subscribe({
      next: () => {
        this.saving = false;
        this.snackBar.open('Nombre actualizado correctamente', 'Cerrar', { duration: 2500 });
      },
      error: (err) => {
        console.error('Error guardando nombre:', err);
        this.saving = false;
        this.snackBar.open('Error al guardar el nombre', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
