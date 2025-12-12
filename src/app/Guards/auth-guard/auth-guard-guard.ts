import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { catchError, map, Observable, of } from 'rxjs';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';

export const authGuard: CanActivateFn = (route, state) => {
  //const authService: AuthService = inject(AuthService)
  const router = inject(Router);
  //const usuarioService: UsuarioService = inject(UsuarioService);

  if (localStorage.getItem("usuario")
  ) {

    return true;
  } else {
    return router.createUrlTree(['/']);
  }

};

