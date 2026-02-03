import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Com Cookies HttpOnly, não pegamos mais o token manualmente do localStorage
  // O navegador enviará o cookie automaticamente se a requisição for para o mesmo domínio.

  // Clonamos a requisição para adicionar a permissão de credenciais (cookies)
  const authReq = req.clone({
    withCredentials: true // OBRIGATÓRIO para que o navegador envie o Cookie HttpOnly
  });

  return next(authReq);
};