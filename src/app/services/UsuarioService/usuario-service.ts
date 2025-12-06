import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, from, map, Observable, Subscribable, Subscription } from 'rxjs';
import { Usuario } from '../../interfaces/Usuario';
import { arrayUnion, collection, doc, docData, DocumentData, DocumentReference, DocumentSnapshot, Firestore, getDocs, increment, QueryDocumentSnapshot, QuerySnapshot, updateDoc } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged, onIdTokenChanged } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { url_servidor } from '../../urlServidor';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { JwtGlobalStoreService } from '../Global/JWTGlobalStoreService/jwt-global-store-service';
import { UsuarioGlobalStoreService } from '../Global/UsuarioGlobalStoreService/usuario-global-store-service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient); 

  private jwtStoreService: JwtGlobalStoreService = inject(JwtGlobalStoreService);
  private JWToken: Signal<string> = this.jwtStoreService.token

  private usuarioStoreService: UsuarioGlobalStoreService = inject(UsuarioGlobalStoreService);
  private usuario: Signal<Usuario> = this.usuarioStoreService.usuario;


  constructor() {
    if (localStorage.getItem('usuario')) {
      const usuarioAlmacenado: Usuario = JSON.parse(String(localStorage.getItem('usuario'))) as Usuario;
      const uidAlmacenado: string = String(usuarioAlmacenado.uid);

      this.obtenerUsuario(uidAlmacenado).subscribe((usuario: Usuario) => {
        this.usuarioStoreService.setUsuarioSignal(usuario)
      })

    }
  }

  clearUsuario() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('tokenJWT');
    localStorage.removeItem("token")
    this.usuarioStoreService.setUsuarioSignal(null)
    this.jwtStoreService.setTokenSignal(null)
  }

  actualizarNombreYfotoUsuario(nombre: string, foto: string, uid: string): Observable<Usuario> {
    const usuarioActualizar: Usuario = { nombre: nombre, fotoURL: foto };
    const jwtCliente = this.JWToken();
    return this.http.patch<Usuario>(url_servidor + "/api/usuarios/actualizar-nombre-foto/" + uid, usuarioActualizar, {
      headers: {
        "Authorization": "Bearer " + jwtCliente
      }
    })

  }


  obtenerUsuarios(limite: number): Observable<Usuario[]> {
    const jwtCliente = this.JWToken();;
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
    const jwtCliente = this.JWToken();;
    return this.http.get<Usuario | any>(url_servidor + "/api/usuarios/obtener/" + uid, {
      headers: { "Authorization": "Bearer " + jwtCliente }
    })
  }

}
