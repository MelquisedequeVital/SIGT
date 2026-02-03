import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Como não podemos ler o Cookie via JS, a forma segura de validar a sessão
  // é tentar uma chamada simples ao backend que use o cookie.
  // Se o backend responder 200 OK, o usuário está logado.
  
  // Opção A: Se você tiver um método no AuthService que verifica o status
  // ou simplesmente permitir a navegação e deixar o Interceptor lidar com erros 401.
  
  // Por enquanto, para o seu sistema voltar a funcionar imediatamente:
  // Vamos verificar se existe um sinal de que o usuário logou, 
  // ou mudar a lógica para "Confiança Otimista".
  
  const isLogged = sessionStorage.getItem('isLoggedIn'); // Sinalizador simples (não é o token)

  if (isLogged === 'true') {
    return true;
  }

  // Se não houver sinal, manda para o login
  router.navigate(['/login']);
  return false;
};