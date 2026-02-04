import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router'; // Importe o Router corretamente
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router); // Injeção correta do Router
  private readonly API = 'http://localhost:8080/auth';

  login(dados: { matricula: string; senha: string }) {
    // O 'withCredentials: true' faz o navegador anexar o Cookie HttpOnly automaticamente
    return this.http.post(`${this.API}/login`, dados, { withCredentials: true });
  }

  register(dados: { matricula: string; senha: string }) {
    return this.http.post(`${this.API}/register`, dados);
  }

  logout() {
  // Chamamos o endpoint de logout do Java com 'withCredentials' para ele saber qual cookie apagar
  this.http.post(`${this.API}/logout`, {}, { withCredentials: true }).subscribe({
    next: () => {
      // Só limpamos o estado local após o servidor confirmar a remoção do cookie
      sessionStorage.removeItem('isLoggedIn');
      this.router.navigate(['/login']);
      
      // Dica extra: Recarregar a página garante a limpeza total do estado da app
      window.location.reload();
    },
    error: (err) => {
      console.error('Erro ao comunicar logout ao servidor', err);
      // Mesmo com erro, limpamos o local por segurança
      sessionStorage.removeItem('isLoggedIn');
      this.router.navigate(['/login']);
    }
  });
}
}