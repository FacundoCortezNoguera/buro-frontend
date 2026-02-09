import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Toolbar } from '../../../shared/toolbar/toolbar';
import { ReporteService, Reporte } from '../../../core/services/reporte';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    Toolbar,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes implements OnInit {
  reportes: Reporte[] = [];
  loading = false;
  enviando = false;

  displayedColumns = ['fecha', 'titulo', 'empleados', 'total', 'estado', 'acciones'];

  constructor(
    private reporteService: ReporteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.loading = true;
    this.reporteService.getAll().subscribe({
      next: (reportes) => {
        this.reportes = reportes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando reportes:', err);
        this.snackBar.open('Error al cargar reportes', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  descargarPdf(reporte: Reporte): void {
    this.reporteService.downloadPdf(reporte.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = reporte.archivoNombre || `reporte_${reporte.id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error descargando PDF:', err);
        this.snackBar.open('Error al descargar el PDF', 'Cerrar', { duration: 3000 });
      }
    });
  }

  enviarPorEmail(reporte: Reporte): void {
    this.enviando = true;
    this.reporteService.enviarPorEmail(reporte.id).subscribe({
      next: (reporteActualizado) => {
        this.enviando = false;
        // Actualizar el reporte en la lista
        const index = this.reportes.findIndex(r => r.id === reporteActualizado.id);
        if (index !== -1) {
          this.reportes[index] = reporteActualizado;
        }
        this.snackBar.open(`Reporte enviado a ${reporteActualizado.emailDestino}`, 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.enviando = false;
        console.error('Error enviando email:', err);
        this.snackBar.open('Error al enviar el reporte por email', 'Cerrar', { duration: 3000 });
      }
    });
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatMonto(monto: number): string {
    if (monto == null) return '$0';
    return '$' + monto.toLocaleString('es-AR', { maximumFractionDigits: 0 });
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'CIERRE_NOCHE': return 'Cierre de Noche';
      case 'RESUMEN_SEMANAL': return 'Resumen Semanal';
      case 'RESUMEN_MENSUAL': return 'Resumen Mensual';
      default: return tipo;
    }
  }
}
