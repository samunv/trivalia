import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { doc, Firestore, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { nanoid } from 'nanoid';

import { from, Observable, of, switchMap } from 'rxjs';
import { Usuario } from '../../interfaces/Usuario';
import { HttpClient } from '@angular/common/http';
import { url_servidor } from '../../urlServidor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore, private http: HttpClient) { }


  // Obtiene el usuario de Firestore por UID
  private obtenerUsuario(proveedor: string, uid: string, user?: User): Observable<Usuario> {

    // Referencia de la colección usuarios
    const usuariosRef = doc(this.firestore, `usuarios/${uid}`);

    return from(getDoc(usuariosRef)).pipe(
      switchMap(docSnap => {
        if (docSnap.exists()) {
          return of(docSnap.data());
        } else {
          // Si no existe, creamos usando datos del proveedor opcional
          const nuevoUsuario: Usuario = {
            nombre: user?.displayName?.substring(0, 15) || 'usuario_' + nanoid(5),
            email: user?.email || '',
            fotoURL: "https://avatar.iran.liara.run/username?username=" + user?.displayName?.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]/g, '') + "&bold=true",
            creadoEn: serverTimestamp(),
            codigo_usuario: nanoid(25),
            estrellas: 0,
            monedas: 100,
            vidas: 7,
            logros: [],
          };
          return from(setDoc(usuariosRef, nuevoUsuario)).pipe(
            switchMap(() => of(nuevoUsuario))
          );
        }
      })
    );
  }

  loginConGoogle(): Observable<{ usuario: Usuario, token: string }> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap(result =>
        this.obtenerUsuario("Google", result.user.uid, result.user).pipe(
          switchMap(usuario =>
            from(result.user.getIdToken()).pipe(
              switchMap(token => of({ usuario, token }))
            )
          )
        )
      )
    );
  }

  autenticar(firebaseToken: string | any): Observable<{ token: string } | { error: string }> {

    return this.http.post<{ token: string } | { error: string }>(url_servidor + "/auth/login", { firebaseToken: firebaseToken })
  }


  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
