import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Usuario } from '../../interfaces/Usuario';
import { arrayUnion, doc, DocumentReference, Firestore, increment, updateDoc } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, onIdTokenChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //private usuarioSubject = new BehaviorSubject<Usuario | any>(JSON.parse(localStorage.getItem('usuario') || 'null'));
  //private tokenSubject = new BehaviorSubject<string | any>(localStorage.getItem('tokenJWT'));

  private tokenSignal = signal<string | any>(localStorage.getItem('tokenJWT'))
  public readonly token = this.tokenSignal.asReadonly();

  private usuarioSignal = signal<Usuario | any>(JSON.parse(localStorage.getItem('usuario') || 'null'))
  public readonly usuario = this.usuarioSignal.asReadonly();

  constructor(private firestore: Firestore) { }

  //usuario$: Observable<Usuario> = this.usuarioSubject.asObservable();
  //token$: Observable<string | any> = this.tokenSubject.asObservable();

  setUsuario(usuario: Usuario | null) {
    this.usuarioSignal.set(usuario);
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario');
    }
  }

  updateUsuario(claveDatoParaActualizar: string, valorDatoParaActualizar: any) {
    this.usuarioSignal.update(usuario => {
      if (!usuario) return usuario;
      const actualizado = { ...usuario, [claveDatoParaActualizar]: valorDatoParaActualizar };
      localStorage.setItem('usuario', JSON.stringify(actualizado));
      return actualizado;
    });
  }

  setToken(token: string | null) {
    this.tokenSignal.set(token);
    if (token) {
      localStorage.setItem('tokenJWT', token);
    } else {
      localStorage.removeItem('tokenJWT');
    }
  }


  clearUsuario() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('tokenJWT');
    localStorage.removeItem("token")
    this.usuarioSignal.set(null);
    this.tokenSignal.set(null);
  }

  actualizarUsuario(uid: string, nombre: string, foto: string): Observable<any> {
    const usuarioDocRef = doc(this.firestore, 'usuarios', uid);
    return from(updateDoc(usuarioDocRef, {
      nombre: nombre.trim(),
      fotoURL: foto,
      actualizado: new Date()
    }));

  }

  actualizarItemsUsuario(uid: string, monedas?: number, vidas?: number, estrellas?: number): Observable<any> {
    const usuarioDocRef = doc(this.firestore, 'usuarios', uid);

    const datosParaActualizar: any = {
      actualizado: new Date()
    };

    if (monedas !== undefined) datosParaActualizar.monedas = monedas;
    if (vidas !== undefined) datosParaActualizar.vidas = vidas;
    if (estrellas !== undefined) datosParaActualizar.estrellas = increment(estrellas);

    return from(updateDoc(usuarioDocRef, datosParaActualizar));
  }

  actualizarArrayPreguntasJugadas(uid: string, idPregunta: number): Observable<any> {
    const usuarioDocRef = doc(this.firestore, 'usuarios', uid);

    return from(updateDoc(usuarioDocRef, {
      arrayIdPreguntasGanadas: arrayUnion(idPregunta)
    }));
  }

  async actualizarPreguntasFalladas(uid: string): Promise<any> {
    const usuarioDocRef = doc(this.firestore, 'usuarios', uid);
    try {
      await updateDoc(usuarioDocRef, { preguntasFalladas: increment(1) });
      console.log("Actualización exitosa");
    } catch (err) {
      console.error("Error actualizando preguntasFalladas:", err);
    }
  }

}
