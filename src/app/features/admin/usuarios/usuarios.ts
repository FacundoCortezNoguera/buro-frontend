import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';

import { Toolbar } from '../../../shared/toolbar/toolbar';
import { UsuarioService, Usuario, UsuarioCreate } from '../../../core/services/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Toolbar,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatChipsModule,
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  saving = false;
  showForm = false;

  nuevoUsuario: UsuarioCreate = {
    username: '',
    password: '',
    nombre: '',
    role: 'RRHH'
  };

  roles = ['ADMIN', 'RRHH', 'CAJA', 'SUPERVISOR'];

  displayedColumns = ['username', 'nombre', 'role', 'enabled', 'acciones'];

  constructor(
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.nuevoUsuario = {
      username: '',
      password: '',
      nombre: '',
      role: 'RRHH'
    };
  }

  crearUsuario(): void {
    if (!this.nuevoUsuario.username || !this.nuevoUsuario.password || !this.nuevoUsuario.nombre) {
      this.snackBar.open('Completá todos los campos', 'Cerrar', { duration: 2500 });
      return;
    }

    this.saving = true;
    this.usuarioService.createUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.snackBar.open('Usuario creado exitosamente', 'Cerrar', { duration: 2000 });
        this.saving = false;
        this.showForm = false;
        this.resetForm();
        this.cargar();
      },
      error: (err) => {
        console.error('Error creando usuario:', err);
        this.snackBar.open('Error al crear usuario', 'Cerrar', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  toggleEnabled(usuario: Usuario): void {
    this.usuarioService.toggleEnabled(usuario.id).subscribe({
      next: (updated) => {
        usuario.enabled = updated.enabled;
        const estado = usuario.enabled ? 'habilitado' : 'deshabilitado';
        this.snackBar.open(`Usuario ${estado}`, 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error actualizando usuario:', err);
        this.snackBar.open('Error al actualizar usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  resetPassword(usuario: Usuario): void {
    const newPassword = prompt(`Nueva contraseña para ${usuario.username}:`);
    if (!newPassword) return;

    this.usuarioService.resetPassword(usuario.id, newPassword).subscribe({
      next: () => {
        this.snackBar.open('Contraseña actualizada', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error reseteando contraseña:', err);
        this.snackBar.open('Error al resetear contraseña', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'ADMIN': return 'warn';
      case 'RRHH': return 'primary';
      case 'CAJA': return 'accent';
      case 'SUPERVISOR': return 'primary';
      default: return '';
    }
  }
}
