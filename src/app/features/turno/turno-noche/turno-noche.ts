import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { EmpleadoService } from '../../../core/services/empleado';
import { Toolbar } from '../../../shared/toolbar/toolbar';
import { Empleado, DiaSemana } from '../../../core/model/empleado.model';
import { AsistenciaService, Asistencia, EstadoAsistencia } from '../../../core/services/asistencia';
import { CambioEmpleadoService } from '../../../core/services/cambio-empleado';
import { FormsModule } from '@angular/forms';

type ViewRow = {
  empleado: Empleado;
  asistencia: Asistencia | null;
  cargoAsignado: string;
  empezoEnCena: boolean;
};

@Component({
  selector: 'app-turno-noche',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Toolbar,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './turno-noche.html',
  styleUrl: './turno-noche.scss',
})
export class TurnoNoche implements OnInit {
  fecha = this.todayISO();
  diaNombre: DiaSemana = this.getDiaNombre(new Date());

  horaEsperada = '22:00';

  cargos = ['Cajero', 'Barra', 'Seguridad', 'RRHH', 'Administración', 'DJ', 'Promotor/a'];

  cargoFiltro: 'Todos' | string = 'Todos';

  rows: ViewRow[] = [];
  loading = false;

  constructor(
    private empleadoService: EmpleadoService,
    private asistenciaService: AsistenciaService,
    private cambioEmpleadoService: CambioEmpleadoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;

    console.log('Cargando datos para fecha:', this.fecha, 'día:', this.diaNombre);

    forkJoin({
      empleados: this.empleadoService.getEmpleados(true),
      asistencias: this.asistenciaService.getAsistenciasByFecha(this.fecha)
    }).subscribe({
      next: ({ empleados, asistencias }) => {
        console.log('Empleados recibidos:', empleados);
        console.log('Asistencias recibidas:', asistencias);

        const deHoy = empleados.filter((e: Empleado) =>
          e.diasTrabajo && e.diasTrabajo.includes(this.diaNombre)
        );
        console.log('Empleados filtrados para hoy:', deHoy);

        this.rows = deHoy.map((emp: Empleado) => {
          const asistenciaExistente = asistencias.find((a: Asistencia) => a.empleadoId === emp.id);
          console.log(`Empleado ${emp.nombre}: asistencia =`, asistenciaExistente);

          return {
            empleado: emp,
            asistencia: asistenciaExistente || null,
            cargoAsignado: emp.cargo || '',
            empezoEnCena: false,
          };
        });

        console.log('Rows finales:', this.rows);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.snackBar.open('Error al cargar datos', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  get rowsFiltradas(): ViewRow[] {
    if (this.cargoFiltro === 'Todos') return this.rows;
    return this.rows.filter(r => r.cargoAsignado === this.cargoFiltro);
  }

  onCargoChange(row: ViewRow): void {
    if (row.cargoAsignado === row.empleado.cargo) {
      return; // No hubo cambio real
    }

    const cargoAnterior = row.empleado.cargo || 'Sin cargo';
    const cargoNuevo = row.cargoAsignado;

    // Crear cambio de cargo y enviar notificación
    this.cambioEmpleadoService.crear({
      empleadoId: row.empleado.id,
      tipoCambio: 'CAMBIO_CARGO',
      campoModificado: 'cargo',
      valorAnterior: cargoAnterior,
      valorNuevo: cargoNuevo,
      descripcion: `Cambio de cargo para la noche del ${this.fecha}: ${cargoAnterior} → ${cargoNuevo}`
    }).subscribe({
      next: () => {
        this.snackBar.open(
          `Cambio de cargo registrado. Se envió notificación por email.`,
          'Cerrar',
          { duration: 4000 }
        );
      },
      error: (err) => {
        console.error('Error registrando cambio:', err);
        this.snackBar.open('Error al registrar el cambio de cargo', 'Cerrar', { duration: 3000 });
        // Revertir el cambio en la UI
        row.cargoAsignado = row.empleado.cargo || '';
      }
    });
  }

  onCenaChange(row: ViewRow): void {
    // TODO: Guardar en backend si es necesario
    console.log(`${row.empleado.nombre} - Empezó en cena: ${row.empezoEnCena}`);
  }

  getEstadoClass(estado: EstadoAsistencia): string {
    switch (estado) {
      case 'TEMPRANO': return 'estado-temprano';
      case 'PUNTUAL': return 'estado-puntual';
      case 'TARDE': return 'estado-tarde';
      default: return '';
    }
  }

  getEstadoLabel(asistencia: Asistencia): string {
    if (asistencia.estado === 'TARDE') {
      return `Tarde (+${asistencia.minutosDiferencia} min)`;
    } else if (asistencia.estado === 'TEMPRANO') {
      return `Temprano (${Math.abs(asistencia.minutosDiferencia)} min antes)`;
    }
    return 'Puntual';
  }

  private todayISO(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private getDiaNombre(d: Date): DiaSemana {
    const names: DiaSemana[] = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    return names[d.getDay()];
  }
}
