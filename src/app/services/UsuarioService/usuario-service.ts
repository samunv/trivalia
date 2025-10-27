import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Usuario } from '../../interfaces/Usuario';
import { arrayUnion, doc, DocumentReference, Firestore, increment, updateDoc } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, onIdTokenChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<Usuario | any>(JSON.parse(localStorage.getItem('usuario') || 'null'));
  private tokenSubject = new BehaviorSubject<string | any>(localStorage.getItem('tokenJWT'));


  constructor(private firestore: Firestore) {


  }

  usuario$: Observable<Usuario> = this.usuarioSubject.asObservable();
  token$: Observable<string | any> = this.tokenSubject.asObservable();

  setUsuario(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  get usuario(): Observable<Usuario> {
    return this.usuarioSubject.asObservable()
  }

  get token(): Observable<string | any> {
    return this.tokenSubject.asObservable()
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
