import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/auth/login';

  login(dados: any) {
    return this.http.post<{token: string}>(this.API, dados).pipe(
      tap(res => {
        // Guarda o token JWT no navegador
        localStorage.setItem('token', res.token);
      })
    );
  }
}