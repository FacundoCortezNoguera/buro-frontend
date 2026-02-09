import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { EmpleadoService } from '../../../core/services/empleado';
import { Empleado } from '../../../core/model/empleado.model';
import { Toolbar } from '../../../shared/toolbar/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ColumnFilter } from '../../../shared/column-filter/column-filter';


@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    ColumnFilter,
    Toolbar
  ],
  templateUrl: './empleado-list.html',
  styleUrl: './empleado-list.scss',
})
export class EmpleadoList {

  displayedColumns: string[] = [
    'nombre',
    'apellido',
    'documentoNumero',
    'telefono',
    'cargo',
    'diasTrabajo',
    'tipoCobro',
    'estado',
    'acciones',
  ];

  dataSource = new MatTableDataSource<Empleado>([]);
  loading = false;

  filters = {
    nombre: '',
    apellido: '',
    documentoNumero: '',
    telefono: '',
    cargo: '',
  };

  constructor(
    private empleadoService: EmpleadoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
    this.configurarFiltroPorColumnas();
  }

  private cargarEmpleados(): void {
    this.loading = true;
    this.empleadoService.getEmpleados().subscribe({
      next: (emps) => {
        this.dataSource.data = emps;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading empleados:', err);
        this.snackBar.open('Error al cargar empleados', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  private configurarFiltroPorColumnas(): void {
    this.dataSource.filterPredicate = (e: Empleado, raw: string) => {
      const f = JSON.parse(raw || '{}');

      const norm = (v: any) => String(v ?? '').toLowerCase().trim();
      const includes = (field: any, term: any) => norm(field).includes(norm(term));

      return (
        includes(e.nombre, f.nombre) &&
        includes(e.apellido, f.apellido) &&
        includes(e.documentoNumero, f.documentoNumero) &&
        includes(e.telefono ?? '', f.telefono) &&
        includes(e.cargo, f.cargo)
      );
    };
  }

  setFilter(col: keyof typeof this.filters, value: string): void {
    this.filters[col] = value ?? '';
    this.dataSource.filter = JSON.stringify(this.filters);
  }

  clearFilter(col: keyof typeof this.filters): void {
    this.filters[col] = '';
    this.dataSource.filter = JSON.stringify(this.filters);
  }

  hasAnyFilter(): boolean {
    return Object.values(this.filters).some((v) => (v ?? '').trim().length > 0);
  }

  clearAllFilters(): void {
    (Object.keys(this.filters) as (keyof typeof this.filters)[]).forEach(
      (k) => (this.filters[k] = '')
    );
    this.dataSource.filter = JSON.stringify(this.filters);
  }

  getTipoCobro(emp: Empleado): string {
    return emp.tipoPago === 'HORA' ? 'Por hora' : 'Por día';
  }

  toggleActivo(emp: Empleado): void {
    this.empleadoService.toggleActivo(emp.id).subscribe({
      next: (updated) => {
        this.cargarEmpleados();
        this.snackBar.open(
          updated.activo ? 'Empleado habilitado' : 'Empleado deshabilitado',
          'Cerrar',
          { duration: 2000 }
        );
      },
      error: () => {
        this.snackBar.open('Error al cambiar estado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminar(emp: Empleado): void {
    if (!confirm(`¿Eliminar a ${emp.nombre} ${emp.apellido} del sistema?`)) return;

    this.empleadoService.eliminar(emp.id).subscribe({
      next: () => {
        this.cargarEmpleados();
        this.snackBar.open('Empleado eliminado', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Error al eliminar empleado', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
