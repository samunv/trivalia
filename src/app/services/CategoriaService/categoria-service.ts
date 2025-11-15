import { computed, inject, Injectable, signal } from '@angular/core';
import { UsuarioService } from './../UsuarioService/usuario-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { url_servidor } from './../../urlServidor';
import { Categoria } from '../../interfaces/Categoria';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private categoriaSignal = signal<string | any>(sessionStorage.getItem("categoriaSeleccionada") || null)
  private usuarioService = inject(UsuarioService)
  public readonly categoria = this.categoriaSignal.asReadonly();


  constructor(private http: HttpClient) { }

  token = this.usuarioService.token


  setCategoria(categoriaSeleccionada: Categoria | null) {
    localStorage.setItem('categoriaSeleccionada', JSON.stringify(categoriaSeleccionada));
    this.categoriaSignal.set(categoriaSeleccionada);
  }

  obtenerCategorias(): Observable<Categoria[] | any> {
    if (!this.token()) {
      throw new Error("No hay token disponible");
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token()}`
    });
    return this.http.get<Categoria[] | any>(url_servidor + "/api/categorias/todo", { headers });
  }

  obtenerCategoriaPorId(idCategoria: number): Observable<Categoria | any> {

    if (!this.token()) {
      throw new Error("No hay token disponible");
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token()}`
    });

    return this.http.get<Categoria | any>(url_servidor + "/api/categorias/obtener/" + idCategoria, { headers });
  }

  jugarCategoria(uid: string): Observable<RespuestaServidor> {
    return this.http.get<RespuestaServidor>(url_servidor + "/api/categorias/jugar/" + uid, {
      headers:
        { "Authorization": "Bearer " + this.token() }
    })
  }

  continuarConMonedas(uid: string): Observable<RespuestaServidor> {
    return this.http.get<RespuestaServidor>(url_servidor + "/api/categorias/continuar-con-monedas/" + uid, {
      headers:
        { "Authorization": "Bearer " + this.token() }
    })
  }
}



