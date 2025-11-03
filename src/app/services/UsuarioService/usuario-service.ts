import { inject, Injectable, signal } from '@angular/core';
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

  private firestore = inject(Firestore)
  private tokenSignal = signal<string | any>(localStorage.getItem('tokenJWT'))
  public readonly token = this.tokenSignal.asReadonly();

  private usuarioSignal = signal<Usuario | any>(JSON.parse(localStorage.getItem('usuario') || 'null'))
  public readonly usuario = this.usuarioSignal.asReadonly();

  constructor() { }

  private usuarioDocRef = doc(this.firestore, 'usuarios', this.usuarioSignal().uid);

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

  actualizarNombreYfotoUsuario(nombre: string, foto: string): Observable<any> {
    return from(updateDoc(this.usuarioDocRef, {
      nombre: nombre.trim(),
      fotoURL: foto,
      actualizado: new Date()
    }));

  }
  // actualizarItemsUsuario(uid: string, monedas?: number, vidas?: number, estrellas?: number): Observable<any> {
  //   const usuarioDocRef = doc(this.firestore, 'usuarios', uid);

  //   const datosParaActualizar: any = {
  //     actualizado: new Date()
  //   };

  //   if (monedas !== undefined) datosParaActualizar.monedas = monedas;
  //   if (vidas !== undefined) datosParaActualizar.vidas = vidas;
  //   if (estrellas !== undefined) datosParaActualizar.estrellas = increment(estrellas);

  //   return from(updateDoc(usuarioDocRef, datosParaActualizar));
  // }

  actualizarItemUsuarioConClaveValor(claveItem: string, cantidadItem: number): Observable<any> {
    const clave =
      claveItem === "vidas" ? "vidas" :
        claveItem === "monedas" ? "monedas" :
          "estrellas";

    return from(updateDoc(this.usuarioDocRef, { [clave]: cantidadItem, }));
  }

  actualizarArrayPreguntasJugadas(idPregunta: number): Observable<any> {
    return from(updateDoc(this.usuarioDocRef, {
      arrayIdPreguntasGanadas: arrayUnion(idPregunta)
    }));
  }

  actualizarFechaUltimoRegaloUsuario(ahora: Date): Observable<any> {
    return from(updateDoc(this.usuarioDocRef, {
      fechaUltimoRegalo: ahora
    }));
  }

  async actualizarPreguntasFalladas(): Promise<any> {
    try {
      await updateDoc(this.usuarioDocRef, {
        preguntasFalladas: increment(1)
      });
      console.log("Actualización exitosa");
    } catch (err) {
      console.error("Error actualizando preguntasFalladas:", err);
    }
  }

}
