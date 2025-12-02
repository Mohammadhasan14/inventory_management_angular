import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding:2rem;">
      <h1>Dashboard</h1>
      <p>Protected dashboard — only visible when authenticated.</p>
      <a routerLink="/login">Go to Login</a>
    </div>
  `
})
export class DashboardComponent {}
