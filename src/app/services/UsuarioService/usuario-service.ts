import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Usuario } from '../../interfaces/Usuario';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, onIdTokenChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('usuario') || 'null'));
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  constructor(private firestore: Firestore) {
    const auth = getAuth();
    onIdTokenChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then(token => {
          localStorage.setItem('token', token);
          this.tokenSubject.next(token);
        });
      } else {
        localStorage.removeItem('token');
        this.tokenSubject.next(null);
      }
    });
  }

  usuario$ = this.usuarioSubject.asObservable();
  token$ = this.tokenSubject.asObservable();

  setUsuario(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  clearUsuario() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);
    this.tokenSubject.next(null);
  }

  actualizarUsuario(uid: string, nombre: string, foto: string): Observable<any> {
    const usuarioDocRef = doc(this.firestore, 'usuarios', uid);
    return from(updateDoc(usuarioDocRef, {
      nombre: nombre.trim(),
      fotoURL: foto,
      actualizado: new Date()
    }));
  }

}
