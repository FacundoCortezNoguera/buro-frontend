import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { HomeAdmin } from './features/home-admin/home-admin';
import { EmpleadoList } from './features/empleados/empleado-list/empleado-list';
import { EmpleadoForm } from './features/empleados/empleado-form/empleado-form';
import { HoraCobro } from './features/pagos/hora-cobro/hora-cobro';
import { TurnoNoche } from './features/turno/turno-noche/turno-noche';
import { Sueldos } from './features/admin/sueldos/sueldos';
import { Usuarios } from './features/admin/usuarios/usuarios';
import { Configuracion } from './features/admin/configuracion/configuracion';
import { Reportes } from './features/admin/reportes/reportes';
import { Destinatarios } from './features/admin/destinatarios/destinatarios';
import { Cambios } from './features/admin/cambios/cambios';
import { AprobarCambio } from './features/cambios/aprobar-cambio/aprobar-cambio';
import { HomeDueno } from './features/dueno/home-dueno/home-dueno';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'home-admin', component: HomeAdmin },
  { path: 'home-dueno', component: HomeDueno },
  { path: 'admin/sueldos', component: Sueldos },
  { path: 'admin/usuarios', component: Usuarios },
  { path: 'admin/configuracion', component: Configuracion },
  { path: 'admin/reportes', component: Reportes },
  { path: 'admin/destinatarios', component: Destinatarios },
  { path: 'admin/cambios', component: Cambios },
  { path: 'cambios/aprobar/:token', component: AprobarCambio },
  { path: 'dueno/reportes', component: Reportes },
  { path: 'empleados', component: EmpleadoList },
  { path: 'empleados/nuevo', component: EmpleadoForm },
  { path: 'pagos', component: HoraCobro},
  { path: 'turno-noche', component: TurnoNoche },
  { path: 'empleados/:id/editar', component: EmpleadoForm },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
