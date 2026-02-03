import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importe o HttpClient

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient); // Injetando o HttpClient diretamente ou via AuthService
  
  isSubmitting = false;

  form = this.fb.group({
    matricula: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[0-9]+$/)]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Enviando os dados para o endpoint de registro do Java
    this.http.post('http://localhost:8080/auth/register', this.form.value, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          alert('Cadastro realizado com sucesso no Supabase!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isSubmitting = false;
          alert('Erro ao cadastrar: ' + (err.error || 'Verifique se o usuário já existe.'));
          console.error('Erro no cadastro:', err);
        }
      });
  }

  // Ajustado para aceitar 'senha' conforme o formGroup
  fieldInvalid(name: 'matricula' | 'senha'): boolean {
    const c = this.form.get(name);
    return !!c && c.touched && c.invalid;
  }
}