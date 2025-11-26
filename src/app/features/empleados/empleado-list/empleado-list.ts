import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {EmpleadoService} from '../../../core/services/empleado';
import { Empleado } from '../../../core/model/empleado.model';
import { Toolbar } from '../../../shared/toolbar/toolbar';


@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    Toolbar
  ],
  templateUrl: './empleado-list.html',
  styleUrl: './empleado-list.scss',
})
export class EmpleadoList {

  displayedColumns = [
    'nombre',
    'dni',
    'puestos',
    'tipoCobro',
    'estado',
    'acciones',
  ];

  empleados: Empleado[] = [];

  constructor(
    private empleadoService: EmpleadoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.empleados = this.empleadoService.getEmpleados();
  }

  getTipoCobro(emp: Empleado): string {
    if (emp.cobraPorHora && emp.cobraPorDia) return 'Hora y día';
    if (emp.cobraPorHora) return 'Por hora';
    if (emp.cobraPorDia) return 'Por día';
    return 'No definido';
  }

  toggleActivo(emp: Empleado): void {
    this.empleadoService.toggleActivo(emp.id);
    this.cargarEmpleados();
    this.snackBar.open(
      emp.activo ? 'Empleado deshabilitado' : 'Empleado habilitado',
      'Cerrar',
      { duration: 2000 }
    );
  }

  eliminar(emp: Empleado): void {
    if (!confirm(`¿Eliminar a ${emp.nombre} del sistema?`)) {
      return;
    }
    this.empleadoService.eliminar(emp.id);
    this.cargarEmpleados();
    this.snackBar.open('Empleado eliminado', 'Cerrar', {
      duration: 2000,
    });
  }

}
