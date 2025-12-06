import { HttpClient, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from 'rxjs';
import { UsuarioService } from '../UsuarioService/usuario-service';
import { AuthService } from '../AuthService/auth-service';
import { url_servidor } from '../../urlServidor';
import { JwtGlobalStoreService } from '../Global/JWTGlobalStoreService/jwt-global-store-service';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private http = inject(HttpClient);
  private jwtStoreServie: JwtGlobalStoreService = inject(JwtGlobalStoreService)
  private JWToken = this.jwtStoreServie.token
  private authService: AuthService = inject(AuthService);

  constructor() {}

  manejarError401ParaRefrescarToken(request: HttpRequest<any>, next: HttpHandlerFn) {
    console.log("Manejando error 401")
    if (!this.isRefreshing) {
      console.log("No es refreshing")
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.refrescarTokenEnServidor().pipe(
        switchMap((response: { token: string }) => {
          console.log("Accediendo a servidor para refrescar token.")
          const nuevoToken = response.token;
          this.jwtStoreServie.setTokenSignal(nuevoToken);
          this.refreshTokenSubject.next(nuevoToken);
          return next(this.realizarPeticionConNuevoToken(request, nuevoToken));
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
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next(this.realizarPeticionConNuevoToken(request, token as string)))
      );
    }
  }

  private realizarPeticionConNuevoToken(request: HttpRequest<any>, token: string) {
    console.log("Realizando petición con el nuevo JWToken: "+token)
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  private refrescarTokenEnServidor(): Observable<{ token: string }> {
    console.log("Enviando petición a /auth/refresh")
    return this.http.post<{ token: string }>(
      `${url_servidor}/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }
}
