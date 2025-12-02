import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="login-card">
      <h2>Sign in</h2>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>
          Email
          <input type="email" formControlName="email" />
        </label>
        <div class="error" *ngIf="form.get('email')?.touched && form.get('email')?.invalid">
          <small *ngIf="form.get('email')?.errors?.['required']">Email is required.</small>
          <small *ngIf="form.get('email')?.errors?.['email']">Enter a valid email.</small>
        </div>

        <label>
          Password
          <input type="password" formControlName="password" />
        </label>
        <div class="error" *ngIf="form.get('password')?.touched && form.get('password')?.invalid">
          <small *ngIf="form.get('password')?.errors?.['required']">Password is required.</small>
          <small *ngIf="form.get('password')?.errors?.['minlength']">Minimum 6 characters.</small>
        </div>

        <div class="actions">
          <button type="submit" [disabled]="loading">{{ loading ? 'Signing in...' : 'Sign in' }}</button>
        </div>

        <div class="server-error" *ngIf="error">
          {{ error }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login-card { max-width: 420px; margin: 4rem auto; padding: 2rem; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.08); background: white; }
    label { display: block; margin-bottom: 0.75rem; }
    input { display: block; width: 100%; padding: 0.5rem; margin-top: 0.25rem; }
    .error small { color: #d33; }
    .actions { margin-top: 1rem; }
    button { width: 100%; padding: 0.6rem; border-radius: 6px; }
    .server-error { margin-top: 1rem; color: #d33; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    this.error = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email as string;
    const password = this.form.value.password as string;

    this.loading = true;

    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed. Check credentials.';
      }
    });
  }
}
