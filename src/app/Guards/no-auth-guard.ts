import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const usuario = localStorage.getItem('usuario');
  const token = localStorage.getItem('tokenJWT');
  const router = inject(Router)

  if (usuario && token) {
    router.navigate(["/aprender"]);
    return false;
  }
  return true;
};
