import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { doc, DocumentReference, Firestore, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { nanoid } from 'nanoid';

import { from, Observable, of, switchMap } from 'rxjs';
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

  // Obtiene el usuario de Firestore por UID
  private obtenerUsuario(proveedor: string, uid: string, user: User): Observable<Usuario> {

    // Referencia de la colección usuarios
    const usuariosRef = doc(this.firestore, `usuarios/${uid}`);

    return from(getDoc(usuariosRef)).pipe(
      switchMap(docSnap => {
        if (docSnap.exists()) {
          return of({ ...docSnap.data(), uid } as Usuario);
        } else {
          return this.crearNuevoUsuario(uid, user, usuariosRef);
        }
      })
    );
  }

  loginConGoogle(): Observable<{ usuario: Usuario, firebaseToken: string }> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap(result =>
        this.obtenerUsuario("Google", result.user.uid, result.user).pipe(
          switchMap(usuario =>
            from(result.user.getIdToken()).pipe(
              switchMap(firebaseToken => of({ usuario, firebaseToken }))
            )
          )
        )
      )
    );
  }


  crearNuevoUsuario(uid: string, user: User, usuariosRef: DocumentReference): Observable<Usuario> {
    // Si no existe, creamos usando datos del proveedor opcional
    const nuevoUsuario: Usuario = {
      uid,
      nombre: user?.displayName?.substring(0, 15) || 'usuario_' + nanoid(5),
      email: user?.email || '',
      fotoURL: user.photoURL,
      creadoEn: serverTimestamp(),
      codigo_usuario: nanoid(25),
      estrellas: 0,
      monedas: 100,
      vidas: 7,
      logros: [],
      arrayIdPreguntasGanadas: [],
      preguntasFalladas: 0
    };
    return from(setDoc(usuariosRef, nuevoUsuario)).pipe(
      switchMap(() => of(nuevoUsuario))
    );
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
