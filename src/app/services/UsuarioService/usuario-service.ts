import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('usuario') || 'null'));
  usuario$ = this.usuarioSubject.asObservable();

  setUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  clearUsuario() {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }
}
