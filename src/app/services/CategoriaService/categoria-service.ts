import { computed, inject, Injectable, signal } from '@angular/core';
import { UsuarioService } from './../UsuarioService/usuario-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { url_servidor } from './../../urlServidor';
import { Categoria } from '../../interfaces/Categoria';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { JwtGlobalStoreService } from '../Global/JWTGlobalStoreService/jwt-global-store-service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private categoriaSignal = signal<string | any>(sessionStorage.getItem("categoriaSeleccionada") || null)
  public readonly categoria = this.categoriaSignal.asReadonly();

  private jwtStoreServie: JwtGlobalStoreService = inject(JwtGlobalStoreService)
  private JWToken = this.jwtStoreServie.token


  constructor(private http: HttpClient) { }



  setCategoria(categoriaSeleccionada: Categoria | null) {
    localStorage.setItem('categoriaSeleccionada', JSON.stringify(categoriaSeleccionada));
    this.categoriaSignal.set(categoriaSeleccionada);
  }

  obtenerCategorias(): Observable<Categoria[] | any> {
    if (!this.JWToken()) {
      throw new Error("No hay token disponible");
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.JWToken()}`
    });
    return this.http.get<Categoria[] | any>(url_servidor + "/api/categorias/todo", { headers });
  }

  obtenerCategoriaPorId(idCategoria: number): Observable<Categoria | any> {

    if (!this.JWToken()) {
      throw new Error("No hay token disponible");
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.JWToken()}`
    });

    return this.http.get<Categoria | any>(url_servidor + "/api/categorias/obtener/" + idCategoria, { headers });
  }


}



