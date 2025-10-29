import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { catchError, map, Observable, of } from 'rxjs';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router)

  return verificarJWT(authService).pipe(
    map((jwtValido: boolean) => {
      if (jwtValido) {
        return router.createUrlTree(["/jugar"])
      } else {
        return true
      }
    })
  )
};

function verificarJWT(authService: AuthService): Observable<boolean> {
  return authService.verificarJWTenServidor().pipe(
    map((res: RespuestaServidor) => res.exito != undefined),
    catchError(err => {
      console.error('Error HTTP:', err);
      return of(false); // en caso de error
    })
  );
}
