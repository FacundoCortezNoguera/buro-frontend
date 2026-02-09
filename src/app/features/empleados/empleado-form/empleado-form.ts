import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { EmpleadoService } from '../../../core/services/empleado';
import { SueldoService, TarifaCargo } from '../../../core/services/sueldo';
import { Toolbar } from '../../../shared/toolbar/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { DiaSemana, EmpleadoCreate, TipoPago } from '../../../core/model/empleado.model';

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
    MatSelectModule,
    MatIconModule,
    Toolbar
  ],
  templateUrl: './empleado-form.html',
  styleUrl: './empleado-form.scss',
})
export class EmpleadoForm implements OnInit {
  form: FormGroup;
  loading = false;
  modo: 'crear' | 'editar' = 'crear';
  empleadoId?: number;

  cargos: TarifaCargo[] = [];
  cargoSeleccionado: TarifaCargo | null = null;

  diasSemana: DiaSemana[] = [
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
    'DOMINGO',
  ];

  diasSemanaLabels: { [key in DiaSemana]: string } = {
    'LUNES': 'Lunes',
    'MARTES': 'Martes',
    'MIERCOLES': 'Miércoles',
    'JUEVES': 'Jueves',
    'VIERNES': 'Viernes',
    'SABADO': 'Sábado',
    'DOMINGO': 'Domingo',
  };

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private sueldoService: SueldoService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      documentoNumero: ['', [Validators.required]],
      telefono: [''],
      cargo: ['', [Validators.required]],
      diasTrabajo: [[], [Validators.required]],
      cobraPorHora: [null],
      cobraPorDia: [null],
      horasPorDia: [8],
      ajustePorcentaje: [0],
      ajusteMonto: [0],
    });

    // Escuchar cambios en el cargo para actualizar el monto base
    this.form.get('cargo')?.valueChanges.subscribe(cargoNombre => {
      this.onCargoChange(cargoNombre);
    });
  }

  ngOnInit(): void {
    this.cargarCargos();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modo = 'editar';
      this.empleadoId = Number(idParam);
      this.cargarEmpleado();
    }
  }

  cargarCargos(): void {
    this.sueldoService.getTarifas().subscribe({
      next: (cargos) => {
        this.cargos = cargos;
      },
      error: (err) => {
        console.error('Error cargando cargos:', err);
      }
    });
  }

  cargarEmpleado(): void {
    if (!this.empleadoId) return;

    this.loading = true;
    this.empleadoService.getById(this.empleadoId).subscribe({
      next: (emp) => {
        this.loading = false;
        this.form.patchValue({
          nombre: emp.nombre,
          apellido: emp.apellido,
          documentoNumero: emp.documentoNumero,
          telefono: emp.telefono ?? '',
          cargo: emp.cargo,
          diasTrabajo: emp.diasTrabajo,
          cobraPorHora: emp.cobraPorHora,
          cobraPorDia: emp.cobraPorDia,
          horasPorDia: emp.horasPorDia ?? 8,
          ajustePorcentaje: emp.ajustePorcentaje ?? 0,
          ajusteMonto: emp.ajusteMonto ?? 0,
        });
        // Actualizar cargo seleccionado
        if (emp.cargo) {
          this.onCargoChange(emp.cargo);
        }
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Empleado no encontrado', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/empleados']);
      }
    });
  }

  onCargoChange(cargoNombre: string): void {
    this.cargoSeleccionado = this.cargos.find(c => c.cargo === cargoNombre) || null;

    if (this.cargoSeleccionado) {
      // Auto-completar el monto base del cargo si está vacío
      if (this.cargoSeleccionado.tipoPago === 'HORA' && !this.form.get('cobraPorHora')?.value) {
        this.form.patchValue({ cobraPorHora: this.cargoSeleccionado.montoPorHora });
      } else if (this.cargoSeleccionado.tipoPago === 'DIA' && !this.form.get('cobraPorDia')?.value) {
        this.form.patchValue({ cobraPorDia: this.cargoSeleccionado.montoPorDia });
      }
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.snackBar.open('Completá todos los campos obligatorios', 'Cerrar', {
        duration: 2000,
      });
      return;
    }

    if (!this.cargoSeleccionado) {
      this.snackBar.open('Seleccioná un cargo', 'Cerrar', { duration: 2000 });
      return;
    }

    const {
      nombre, apellido, documentoNumero, telefono,
      cargo, diasTrabajo,
      cobraPorHora, cobraPorDia, horasPorDia,
      ajustePorcentaje, ajusteMonto,
    } = this.form.value;

    // tipoPago viene del cargo seleccionado, no del formulario
    const tipoPago = this.cargoSeleccionado.tipoPago;

    this.loading = true;

    const payload: EmpleadoCreate = {
      nombre,
      apellido,
      documentoNumero,
      telefono,
      cargo,
      diasTrabajo,
      tipoPago: tipoPago as TipoPago,
      cobraPorHora: tipoPago === 'HORA' ? cobraPorHora : undefined,
      cobraPorDia: tipoPago === 'DIA' ? cobraPorDia : undefined,
      horasPorDia: tipoPago === 'HORA' ? horasPorDia : undefined,
      ajustePorcentaje: ajustePorcentaje || 0,
      ajusteMonto: ajusteMonto || 0,
    };

    if (this.modo === 'editar' && this.empleadoId != null) {
      this.empleadoService.update(this.empleadoId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Empleado actualizado', 'Cerrar', { duration: 2000 });
          this.router.navigate(['/empleados']);
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
        }
      });
      return;
    }

    this.empleadoService.agregar(payload).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Empleado registrado', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/empleados']);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al registrar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/empleados']);
  }
}
