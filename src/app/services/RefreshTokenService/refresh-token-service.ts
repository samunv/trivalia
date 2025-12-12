import { HttpClient, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../AuthService/auth-service';
import { url_servidor } from '../../urlServidor';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private isRefreshing = false;
  private refreshSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private http = inject(HttpClient);
  private authService: AuthService = inject(AuthService);

  constructor() { }

  manejarError401ParaRefrescarToken(request: HttpRequest<any>, next: HttpHandlerFn) {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshSubject.next(false); // Resetear estado

      return this.refrescarTokenEnServidor().pipe(
        switchMap((response: RespuestaServidor) => {
          if (response.resultado === true) {
            //Notificar a todos que el refresh terminó
            this.refreshSubject.next(true);
            // Reintentar la request original
            return next(request.clone({ withCredentials: true }));
          } else {
            throw new Error("Error al refrescar tokens");
          }
        }),
        catchError((err: any) => {
          this.authService.logout().subscribe();
          return throwError(() => err);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {

      return this.refreshSubject.pipe(
        filter(exito => exito === true), // Esperar a que sea true
        take(1), // Tomar solo el primer valor
        switchMap(() => {
          return next(request.clone({ withCredentials: true }));
        })
      );
    }
  }

  private refrescarTokenEnServidor(): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(
      `${url_servidor}/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }
}
