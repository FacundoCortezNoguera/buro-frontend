import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Empleado } from '../../../core/model/empleado.model';
import { EmpleadoService } from '../../../core/services/empleado';
import { Toolbar } from '../../../shared/toolbar/toolbar';

//--------------sacar despues----------------
interface CobroEmpleadoDia {
  empleado: Empleado;
  horasTrabajadas: number;
  diasTrabajados: number;
  descuentoTardanza: number;
  adelanto: number;
  montoCalculado: number;
  cobrado: boolean;
}


@Component({
  selector: 'app-hora-cobro',
    standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    Toolbar,
  ],
  templateUrl: './hora-cobro.html',
  styleUrl: './hora-cobro.scss',
})
export class HoraCobro {
  listaCobros: CobroEmpleadoDia[] = [];
  calculadoHoy = false;

  constructor(
    private empleadoService: EmpleadoService,
    private snackBar: MatSnackBar
  ) {}

  calcularCobrosDelDia(): void {
    const empleadosActivos = this.empleadoService
      .getEmpleados()
      .filter((e) => e.activo);

    if (empleadosActivos.length === 0) {
      this.snackBar.open('No hay empleados activos para calcular.', 'Cerrar', {
        duration: 2000,
      });
      return;
    }

    // En un caso real vendrían de fichadas/biometría, acá mock:
    const tarifaHora = 3000; // 💸 mock
    const tarifaDia = 20000; // 💸 mock

    this.listaCobros = empleadosActivos.map((emp, index) => {
      const horas = emp.cobraPorHora ? 8 : 0; // mock: jornada completa
      const dias = emp.cobraPorDia ? 1 : 0;   // mock: un día trabajado

      // Mock de descuentos y adelantos para mostrar el concepto
      const descuentoTardanza = index === 0 ? 0 : 2000; // algunos con descuento
      const adelanto = index === 1 ? 5000 : 0;

      const montoBase = horas * tarifaHora + dias * tarifaDia;
      const montoCalculado = montoBase - descuentoTardanza - adelanto;

      return {
        empleado: emp,
        horasTrabajadas: horas,
        diasTrabajados: dias,
        descuentoTardanza,
        adelanto,
        montoCalculado: montoCalculado < 0 ? 0 : montoCalculado,
        cobrado: false,
      };
    });

    this.calculadoHoy = true;
    this.snackBar.open('Cobros del día calculados (mock).', 'Cerrar', {
      duration: 2000,
    });
  }

  toggleCobrado(cobro: CobroEmpleadoDia): void {
    cobro.cobrado = !cobro.cobrado;
    this.snackBar.open(
      cobro.cobrado
        ? `${cobro.empleado.nombre} marcado como cobrado.`
        : `${cobro.empleado.nombre} marcado como pendiente.`,
      'Cerrar',
      { duration: 2000 }
    );
  }

  cardClicked(cobro: CobroEmpleadoDia): void {
    // Al clickear la card también alternamos cobrado
    this.toggleCobrado(cobro);
  }

  finalizarDia(): void {
    if (!this.calculadoHoy || this.listaCobros.length === 0) {
      this.snackBar.open('Primero calculá las horas del día.', 'Cerrar', {
        duration: 2000,
      });
      return;
    }

    const pendientes = this.listaCobros.filter((c) => !c.cobrado);

    // Guardamos mock de pendientes en localStorage para "continuar después"
    localStorage.setItem(
      'cobrosPendientes',
      JSON.stringify(this.listaCobros)
    );

    if (pendientes.length > 0) {
      this.snackBar.open(
        `Día cerrado con ${pendientes.length} empleados pendientes (guardado mock).`,
        'Cerrar',
        { duration: 3000 }
      );
    } else {
      this.snackBar.open('Día cerrado. Todos los empleados cobraron.', 'Cerrar', {
        duration: 2500,
      });
    }
  }

}
