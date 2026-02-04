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

  // No seu login.ts
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const dados = this.form.getRawValue();

    this.authService.login(dados).subscribe({
      next: () => {
        this.isSubmitting = false;
        console.log('Login bem-sucedido via Cookie!');
        sessionStorage.setItem('isLoggedIn', 'true'); // Define o sinalizador
        this.router.navigate(['/agenda-tcc']);
      },
      error: (err) => {
        this.isSubmitting = false;
        // Aqui usamos o tratamento genérico que configuramos no Req 7
        alert(err.error?.mensagem || 'Erro ao realizar login.');
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