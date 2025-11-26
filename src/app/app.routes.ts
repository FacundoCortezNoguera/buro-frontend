import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { EmpleadoList } from './features/empleados/empleado-list/empleado-list';
import { EmpleadoForm } from './features/empleados/empleado-form/empleado-form';
import { HoraCobro } from './features/pagos/hora-cobro/hora-cobro';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'empleados', component: EmpleadoList },
  { path: 'empleados/nuevo', component: EmpleadoForm },
  { path: 'pagos', component: HoraCobro},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
