import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EmpleadoService } from '../../../core/services/empleado';
import { Toolbar } from '../../../shared/toolbar/toolbar';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    Toolbar
  ],
  templateUrl: './empleado-form.html',
  styleUrl: './empleado-form.scss',
})
export class EmpleadoForm {
    form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      puestosTexto: ['', [Validators.required]], // "Cajero, Barra"
      cobraPorHora: [false],
      cobraPorDia: [false],
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.snackBar.open('Completá todos los campos obligatorios', 'Cerrar', {
        duration: 2000,
      });
      return;
    }

    const { nombre, dni, puestosTexto, cobraPorHora, cobraPorDia } =
      this.form.value;

    if (!cobraPorHora && !cobraPorDia) {
      this.snackBar.open(
        'Seleccioná al menos un tipo de cobro (hora o día)',
        'Cerrar',
        { duration: 2500 }
      );
      return;
    }

    const puestos = (puestosTexto as string)
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    this.loading = true;

    // mock
    setTimeout(() => {
      this.empleadoService.agregar({
        nombre,
        dni,
        puestos,
        cobraPorHora,
        cobraPorDia,
        activo: true,
      });

      this.loading = false;
      this.snackBar.open('Empleado registrado (mock)', 'Cerrar', {
        duration: 2000,
      });

      this.router.navigate(['/empleados']);
    }, 700);
  }

  cancelar(): void {
    this.router.navigate(['/empleados']);
  }

}
