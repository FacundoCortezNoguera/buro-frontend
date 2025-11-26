import { Injectable } from '@angular/core';
import { Empleado } from '../model/empleado.model';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
    private empleados: Empleado[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      dni: '30111222',
      puestos: ['Cajero'],
      cobraPorHora: true,
      cobraPorDia: false,
      activo: true,
    },
    {
      id: 2,
      nombre: 'Ana Gómez',
      dni: '28999888',
      puestos: ['RRHH', 'Administración'],
      cobraPorHora: false,
      cobraPorDia: true,
      activo: true,
    },
    {
      id: 3,
      nombre: 'Carlos Ruiz',
      dni: '33123456',
      puestos: ['Seguridad'],
      cobraPorHora: true,
      cobraPorDia: true,
      activo: false,
    },
  ];

  getEmpleados(): Empleado[] {
    return [...this.empleados];
  }

  toggleActivo(id: number): void {
    const emp = this.empleados.find((e) => e.id === id);
    if (emp) {
      emp.activo = !emp.activo;
    }
  }

  eliminar(id: number): void {
    this.empleados = this.empleados.filter((e) => e.id !== id);
  }

   agregar(datos: Omit<Empleado, 'id'>): void {
    const nuevoId =
      this.empleados.length > 0
        ? Math.max(...this.empleados.map((e) => e.id)) + 1
        : 1;

    const nuevo: Empleado = {
      id: nuevoId,
      ...datos,
    };

    this.empleados.push(nuevo);
  }
  
}
