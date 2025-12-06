import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Usuario } from '../../../interfaces/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGlobalStoreService {
  private usuarioSignal: WritableSignal<Usuario | any> = signal<Usuario | any>(JSON.parse(localStorage.getItem('usuario') || 'null'))
  public readonly usuario: Signal<Usuario | any> = this.usuarioSignal.asReadonly();


  setUsuarioSignal(usuario: Usuario | null) {
    this.usuarioSignal.set(usuario);
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario');
    }
  }

  updateUsuarioSignal(claveDatoParaActualizar: string, valorDatoParaActualizar: any) {
    this.usuarioSignal.update(usuario => {
      if (!usuario) return usuario;
      const actualizado = { ...usuario, [claveDatoParaActualizar]: valorDatoParaActualizar };
      localStorage.setItem('usuario', JSON.stringify(actualizado));
      return actualizado;
    });
  }
}
