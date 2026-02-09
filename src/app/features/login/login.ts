import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private auth: Auth
  ) {
    this.form = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      recordar: [false],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.snackBar.open('Completá usuario y contraseña', 'Cerrar', {
        duration: 2500,
      });
      return;
    }

    this.loading = true;
    const { usuario, password } = this.form.value;

    this.auth.login(usuario, password).subscribe({
      next: (success) => {
        this.loading = false;
        if (success) {
          const route = this.auth.homeRoute();
          console.log('Login exitoso. Usuario:', this.auth.user);
          console.log('Navegando a:', route);
          this.snackBar.open('Login exitoso', 'Cerrar', {
            duration: 2000,
          });
          this.router.navigateByUrl(route).then(
            (navigated) => console.log('Navegación exitosa:', navigated),
            (error) => console.error('Error navegando:', error)
          );
        } else {
          this.snackBar.open('Credenciales inválidas', 'Cerrar', {
            duration: 3000,
          });
        }
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al conectar con el servidor', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
}
