import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service'; // Ajuste o caminho

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isSubmitting = false;

  showPassword = false;

  // Alterado para coincidir com o Backend Java
  form = this.fb.nonNullable.group({
    matricula: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const dados = this.form.getRawValue();

    this.authService.login(dados as { matricula: string; senha: string }).subscribe({
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

  togglePassword() {
  this.showPassword = !this.showPassword;
}
}