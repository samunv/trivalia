import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, from, map, Observable, Subscribable, Subscription } from 'rxjs';
import { Usuario } from '../../interfaces/Usuario';
import { arrayUnion, collection, doc, docData, DocumentData, DocumentReference, DocumentSnapshot, Firestore, getDocs, increment, QueryDocumentSnapshot, QuerySnapshot, updateDoc } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, onIdTokenChanged } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { url_servidor } from '../../urlServidor';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private firestore = inject(Firestore)
  private http = inject(HttpClient);

  private tokenSignal: WritableSignal<string | any> = signal<string | any>(localStorage.getItem('tokenJWT'))
  public readonly token: Signal<string> = this.tokenSignal.asReadonly();

  private usuarioSignal: WritableSignal<Usuario | any> = signal<Usuario | any>(JSON.parse(localStorage.getItem('usuario') || 'null'))
  public readonly usuario: Signal<Usuario | any> = this.usuarioSignal.asReadonly();


  constructor() {
    if (localStorage.getItem('usuario')) {
      this.setUsuarioSignal(JSON.parse(String(localStorage.getItem('usuario'))) as Usuario)
    }
  }

  private get usuarioDocRef() {
    const uid = this.usuarioSignal()?.uid;
    if (!uid) throw new Error("Usuario no logueado");
    return doc(this.firestore, 'usuarios', uid);
  }


  setUsuarioSignal(usuario: Usuario) {
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


  setTokenSignal(token: string | null) {
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

  actualizarNombreYfotoUsuario(nombre: string, foto: string, uid: string): Observable<Usuario> {
    const usuarioActualizar: Usuario = { nombre: nombre, fotoURL: foto };
    const jwtCliente = this.token();
    return this.http.patch<Usuario>(url_servidor + "/api/usuarios/actualizar-nombre-foto/" + uid, usuarioActualizar, {
      headers: {
        "Authorization": "Bearer " + jwtCliente
      }
    })

  }


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

  async actualizarPartidasGanadas() {
    try {
      await updateDoc(this.usuarioDocRef, { partidasGanadas: increment(1) })
      console.log("Actualización de partidas ganadas exitosa");

    } catch (error) {
      console.log(error)
    }
  }

  async actualizarRegaloDisponible(valor: boolean) {
    try {
      await updateDoc(this.usuarioDocRef, { regaloDisponible: valor })
      console.log("Actualización de regalo disponible exitosa");
    } catch (error) {
      console.log(error)
    }
  }

  obtenerUsuarios(limite: number): Observable<Usuario[]> {
    const jwtCliente = this.token();
    return this.http.get<Usuario[]>(url_servidor + "/api/usuarios/listar/" + limite, {
      headers: {
        "Authorization": "Bearer " + jwtCliente
      }
    })

  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    // No necesita JWT porque es una operación pública
    return this.http.post<Usuario>(url_servidor + "/api/usuarios/crear", usuario,
    );
  }

  obtenerUsuario(uid: string): Observable<Usuario> {
    const jwtCliente = this.token();
    return this.http.get<Usuario | any>(url_servidor + "/api/usuarios/" + uid, {
      headers: { "Authorization": "Bearer " + jwtCliente }
    })
  }

}
