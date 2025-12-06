import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { doc, DocumentReference, Firestore, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { nanoid } from 'nanoid';

import { BehaviorSubject, catchError, map, Observable, of, switchMap, throwError, filter, take, finalize, from } from 'rxjs';
import { Usuario } from '../../interfaces/Usuario';
import { HttpClient, HttpEvent, HttpHandler, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { url_servidor } from '../../urlServidor';
import { UsuarioService } from '../UsuarioService/usuario-service';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { JwtGlobalStoreService } from '../Global/JWTGlobalStoreService/jwt-global-store-service';
import { UsuarioGlobalStoreService } from '../Global/UsuarioGlobalStoreService/usuario-global-store-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private jwtStoreServie: JwtGlobalStoreService = inject(JwtGlobalStoreService)
  private JWToken = this.jwtStoreServie.token
  private usuarioStoreService: UsuarioGlobalStoreService = inject(UsuarioGlobalStoreService);
  private usuario: Signal<Usuario> = this.usuarioStoreService.usuario;

  constructor(private auth: Auth) { }

  login(): Observable<{ usuario: Usuario, firebaseToken: string }> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap(result =>
        this.crearUsuario(result.user.uid, result.user).pipe(
          switchMap(usuario =>
            from(result.user.getIdToken()).pipe(
              switchMap(firebaseToken => of({ usuario, firebaseToken }))
            )
          )
        )
      )
    );
  }


  private crearUsuario(uid: string, user: User): Observable<Usuario> {
    const nuevoUsuario: Usuario = {
      uid,
      nombre: user?.displayName || 'usuario_' + nanoid(5),
      email: user?.email || '',
      fotoURL: user.photoURL,
    };

    return this.crearUsuarioEnServidor(nuevoUsuario).pipe(map((usuario) => { return usuario }))
  }

  crearUsuarioEnServidor(usuario: Usuario): Observable<Usuario> {
      // No necesita JWT porque es una operación pública
      return this.http.post<Usuario>(url_servidor + "/api/usuarios/crear", usuario,
      );
    }



  autenticarFirebaseToken(firebaseToken: string | any): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(url_servidor + "/auth/login", { firebaseToken: firebaseToken })
  }


 logout(): Observable<void> {
    return this.logoutEnServidor(this.usuario().uid as string).pipe(
        switchMap(() => from(signOut(this.auth))),
        map(() => undefined as void)
    );
}

  private logoutEnServidor(uid: string): Observable<void> {
    return this.http.post<any>(url_servidor + "/auth/logout/" + uid, {})
  }

}
