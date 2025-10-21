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
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('tokenJWT'));

  constructor(private firestore: Firestore) {
  }

  usuario$ = this.usuarioSubject.asObservable();
  token$ = this.tokenSubject.asObservable();

  setUsuario(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

   setToken(token: string) {
    localStorage.setItem('tokenJWT', token);
    this.tokenSubject.next(token);
  }

  clearUsuario() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('tokenJWT');
    localStorage.removeItem("token")
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
