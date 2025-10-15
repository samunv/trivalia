import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../../interfaces/Usuario';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('usuario') || 'null'));
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  usuario$ = this.usuarioSubject.asObservable();
  token$ = this.tokenSubject.asObservable();

  setUsuario(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);

  }

  clearUsuario() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);
    this.tokenSubject.next(null);
  }
}
