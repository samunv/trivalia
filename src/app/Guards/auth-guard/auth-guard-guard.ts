import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { catchError, map, Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService)
  const router = inject(Router);

  return verificarJWT(authService).pipe(
    map((jwtValido: boolean) => {
      if (jwtValido) {
        return true; // permite acceso
      } else {
        return router.createUrlTree(['/']); // bloquea y redirige a '/': "Login"
      }
    })
  );
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

