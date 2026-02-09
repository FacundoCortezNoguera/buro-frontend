import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Auth } from '../../../core/services/auth/auth';
import { ReporteService, Reporte } from '../../../core/services/reporte';
import { DashboardService } from '../../../core/services/dashboard';
import {
  DashboardResumen,
  EmpleadoRanking,
  AlertaEmpleado,
  Periodo
} from '../../../core/model/dashboard.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home-dueno',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home-dueno.html',
  styleUrl: './home-dueno.scss',
})
export class HomeDueno implements OnInit {
  userName = '';
  loading = false;

  // Selector de periodo
  periodoSeleccionado: Periodo = 'SEMANA';

  // Datos del dashboard
  resumen: DashboardResumen | null = null;
  topPuntuales: EmpleadoRanking[] = [];
  masTardanzas: EmpleadoRanking[] = [];
  alertas: AlertaEmpleado[] = [];
  ultimosReportes: Reporte[] = [];

  constructor(
    private auth: Auth,
    private router: Router,
    private reporteService: ReporteService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const user = this.auth.user;
    this.userName = user?.username || 'Dueño';
    this.cargarDashboard();
  }

  cambiarPeriodo(event: any): void {
    this.periodoSeleccionado = event.value;
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.loading = true;

    forkJoin({
      resumen: this.dashboardService.getResumen(this.periodoSeleccionado),
      topPuntuales: this.dashboardService.getRankingPuntualidad(5),
      masTardanzas: this.dashboardService.getRankingTardanzas(5),
      alertas: this.dashboardService.getAlertas(),
      reportes: this.reporteService.getAll()
    }).subscribe({
      next: (data) => {
        this.resumen = data.resumen;
        this.topPuntuales = data.topPuntuales;
        this.masTardanzas = data.masTardanzas;
        this.alertas = data.alertas;
        this.ultimosReportes = data.reportes.slice(0, 5);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.loading = false;
      }
    });
  }

  formatMonto(monto: number | null | undefined): string {
    if (monto == null) return '$0';
    return '$' + monto.toLocaleString('es-AR', { maximumFractionDigits: 0 });
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatPorcentaje(valor: number | null | undefined): string {
    if (valor == null) return '0%';
    return valor.toFixed(1) + '%';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
