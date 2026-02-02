import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // Verifica se o token existe

  if (token) {
    return true; // Permite o acesso
  }

  // Se não estiver logado, redireciona para o login
  router.navigate(['/login']);
  return false;
};