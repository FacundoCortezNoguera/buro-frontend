export type Rol = 'RRHH' | 'ADMIN' | 'CAJA' | 'SUPERVISOR' | 'DUENO';

export interface User {
  username: string;
  rol: Rol;
}