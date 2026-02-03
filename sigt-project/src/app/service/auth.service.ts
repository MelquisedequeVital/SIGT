import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/auth';

  login(dados: { matricula: string; senha: string }) {
    return this.http.post<{ token: string }>(`${this.API}/login`, dados).pipe(
      tap(res => localStorage.setItem('token', res.token))
    );
  }

  register(dados: { matricula: string; senha: string }) {
    return this.http.post(`${this.API}/register`, dados);
  }
}