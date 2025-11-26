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
    private snackBar: MatSnackBar
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

    // 🔒 Mock de login (sin backend)
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      // Guardamos flag de sesión mock
      localStorage.setItem('isLoggedIn', 'true');
      this.snackBar.open('Login exitoso (mock)', 'Cerrar', {
        duration: 2000,
      });
      this.router.navigate(['/home']); // después creamos /home
    }, 800);
  }

}
