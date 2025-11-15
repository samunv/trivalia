import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { doc, DocumentReference, Firestore, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { nanoid } from 'nanoid';

import { from, map, Observable, of, switchMap } from 'rxjs';
import { Usuario } from '../../interfaces/Usuario';
import { HttpClient } from '@angular/common/http';
import { url_servidor } from '../../urlServidor';
import { UsuarioService } from '../UsuarioService/usuario-service';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioService: UsuarioService = inject(UsuarioService);

  constructor(private auth: Auth, private firestore: Firestore, private http: HttpClient) { }

  token = this.usuarioService.token

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

    return this.usuarioService.crearUsuario(nuevoUsuario).pipe(map((usuario)=>{return usuario}))
  }



  autenticarFirebaseToken(firebaseToken: string | any): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(url_servidor + "/auth/login", { firebaseToken: firebaseToken })
  }


  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  verificarJWTenServidor(): Observable<RespuestaServidor> {
    const jwtCliente = this.token();
    return this.http.post<RespuestaServidor>(url_servidor + "/auth/verificar-jwt", { jwtCliente: jwtCliente })
  }
  
}
