import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.scss',
})
export class HomeAdmin {

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  get userName(): string {
    return this.auth.user?.username || 'Admin';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
