import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {
  @Input() title: string = '';
  @Input() backRoute: string | null = null;

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  goBack(): void {
    if (this.backRoute) {
      this.router.navigate([this.backRoute]);
    } else {
      this.router.navigateByUrl(this.auth.homeRoute());
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
