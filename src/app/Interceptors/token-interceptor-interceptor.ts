import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/AuthService/auth-service';
import { inject, Signal } from '@angular/core';
import { RefreshTokenService } from '../services/RefreshTokenService/refresh-token-service';

export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const refreshTokenService: RefreshTokenService= inject(RefreshTokenService);

  let authReq = req.clone({
    withCredentials: true
  });

  // Manejar el error 401 y el Refresco del token
  return next(authReq).pipe(
    catchError((error) => {
      if ((error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403))) {
        console.log("Hay error 401 o 403: iniciando proceso de refresco del token")
        return refreshTokenService.manejarError401ParaRefrescarToken(authReq, next);
      }
      return throwError(() => error);
    })
  );
};
