import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { catchError, map, Observable, of } from 'rxjs';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';

export const noAuthGuard: CanActivateFn = (route, state) => {
  // const authService = inject(AuthService);
  const router = inject(Router)

  if (localStorage.getItem("usuario")) {

     return router.createUrlTree(["/jugar"])
  } else {
    return true;
  }
};
