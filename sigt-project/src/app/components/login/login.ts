import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service'; // Ajuste o caminho

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isSubmitting = false;

  // Alterado para coincidir com o Backend Java
  form = this.fb.group({
    login: ['', [Validators.required]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/agenda-tcc']); // Redireciona após o login
      },
      error: (err) => {
        this.isSubmitting = false;
        alert('Erro ao realizar login. Verifique suas credenciais.');
        console.error(err);
      }
    });
  }

  fieldInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.touched && c.invalid;
  }
}