import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { doc, Firestore, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { nanoid } from 'nanoid';

import { from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) { }


  // Obtiene el usuario de Firestore por UID
  private obtenerUsuario(proveedor: string, uid: string, user?: User): Observable<any> {
    const userRef = doc(this.firestore, `usuarios/${uid}`);
    return from(getDoc(userRef)).pipe(
      switchMap(docSnap => {
        if (docSnap.exists()) {
          return of(docSnap.data());
        } else {
          // Si no existe, creamos usando datos del proveedor opcional
          const nuevoUsuario = {
            nombre: user?.displayName || 'usuario_' + nanoid(5),
            correo: user?.email || '',
            fotoURL: user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
            creadoEn: serverTimestamp(),
            codigo_usuario: nanoid(25),
            cerebros: 0,
            monedas: 0,
            vidas: 7,
            logros: [],
            proveedor: proveedor
          };
          return from(setDoc(userRef, nuevoUsuario)).pipe(
            switchMap(() => of(nuevoUsuario))
          );
        }
      })
    );
  }

  loginConGoogle(): Observable<{ usuario: any, token: string }> {
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


  register(correo: string, contrasena: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, correo, contrasena)).pipe(
      switchMap(result => this.obtenerUsuario("Trivalia", result.user.uid, result.user))
    );
  }

  login(email: string, password: string): Observable<{ usuario: any, token: string }> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(result =>
        this.obtenerUsuario("Trivalia", result.user.uid, result.user).pipe(
          switchMap(usuario =>
            from(result.user.getIdToken()).pipe(
              switchMap(token => of({ usuario, token }))
            )
          )
        )
      )
    );
  }


  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
