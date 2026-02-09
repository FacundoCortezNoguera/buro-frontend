import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

import { PagoDiarioService } from '../../../core/services/pago-diario';
import { ReporteService } from '../../../core/services/reporte';
import { ResumenPagos, EmpleadoPagoResumen } from '../../../core/model/pago-diario.model';

@Component({
  selector: 'app-pagos-dia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './pagos-dia.html',
  styleUrl: './pagos-dia.scss',
})
export class PagosDia implements OnInit {
  loading = false;
  generandoReporte = false;

  resumen: ResumenPagos | null = null;
  cargoFiltro: 'Todos' | string = 'Todos';

  cargosDisponibles: string[] = [];

  constructor(
    private pagoDiarioService: PagoDiarioService,
    private reporteService: ReporteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;

    this.pagoDiarioService.getResumenPagosDia().subscribe({
      next: (resumen) => {
        console.log('Resumen pagos DIA:', resumen);
        this.resumen = resumen;
        // Solo cargos de empleados (ya vienen filtrados por DIA del backend)
        this.cargosDisponibles = [...new Set(resumen.empleados.map(e => e.cargo).filter(c => c))].sort();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando resumen:', err);
        this.snackBar.open('Error al cargar datos de pagos', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  get empleadosFiltrados(): EmpleadoPagoResumen[] {
    if (!this.resumen) return [];
    // Los empleados ya vienen filtrados por DIA del backend
    let empleados = this.resumen.empleados;
    if (this.cargoFiltro !== 'Todos') {
      empleados = empleados.filter(e => e.cargo === this.cargoFiltro);
    }
    return empleados;
  }

  marcarEmpleadoCobrado(empleado: EmpleadoPagoResumen): void {
    if (!this.resumen) return;

    this.pagoDiarioService.marcarEmpleadoPagado(
      empleado.empleadoId,
      this.resumen.fechaDesde,
      this.resumen.fechaHasta
    ).subscribe({
      next: () => {
        this.snackBar.open(`${empleado.empleadoNombre} marcado como pagado`, 'Cerrar', { duration: 2000 });
        this.cargar(); // Recargar datos
      },
      error: (err) => {
        console.error('Error marcando pagado:', err);
        this.snackBar.open('Error al marcar como pagado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cerrarPeriodo(): void {
    if (!this.resumen) return;

    this.generandoReporte = true;

    // Usar las fechas del resumen actual
    const desde = this.resumen.fechaDesde;
    const hasta = this.resumen.fechaHasta;

    this.reporteService.generarReporteSemanal(desde, hasta).subscribe({
      next: (reporte) => {
        this.snackBar.open('Reporte semanal generado correctamente', 'Cerrar', { duration: 2000 });

        this.reporteService.enviarPorEmail(reporte.id).subscribe({
          next: (reporteEnviado) => {
            this.generandoReporte = false;
            this.snackBar.open(
              `Período cerrado. Reporte enviado a ${reporteEnviado.emailDestino}`,
              'Cerrar',
              { duration: 4000 }
            );
            this.cargar(); // Recargar para mostrar nuevo período
          },
          error: (err) => {
            this.generandoReporte = false;
            console.error('Error enviando email:', err);
            this.snackBar.open(
              'Reporte generado pero no se pudo enviar por email.',
              'Cerrar',
              { duration: 5000 }
            );
            this.cargar(); // Recargar de todos modos
          }
        });
      },
      error: (err) => {
        this.generandoReporte = false;
        console.error('Error generando reporte:', err);
        this.snackBar.open('Error al generar el reporte', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Desglose de billetes
  denominaciones: number[] = [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10];

  desgloseBilletes(total: number): { denom: number; cant: number }[] {
    let restante = Math.max(0, Math.floor(total));
    const out: { denom: number; cant: number }[] = [];

    for (const d of this.denominaciones) {
      const cant = Math.floor(restante / d);
      if (cant > 0) {
        out.push({ denom: d, cant });
        restante -= cant * d;
      }
    }
    return out;
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'TEMPRANO': return 'estado-temprano';
      case 'PUNTUAL': return 'estado-puntual';
      case 'TARDE': return 'estado-tarde';
      default: return '';
    }
  }
}
