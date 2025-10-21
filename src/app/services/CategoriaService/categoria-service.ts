import { Injectable } from '@angular/core';
import { UsuarioService } from './../UsuarioService/usuario-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { url_servidor } from './../../urlServidor';
import { Categoria } from '../../interfaces/Categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private usuarioService: UsuarioService, private http: HttpClient) {}

  obtenerCategorias(): Observable<Categoria[] | any> {
    return this.usuarioService.token$.pipe(
      switchMap((token: string | null) => {
        if (!token) {
          throw new Error("No hay token disponible");
        }
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<Categoria[] | any>(url_servidor + "/api/categorias/todo", { headers });
      })
    );
  }

  obtenerCategoriaPorId(idCategoria: number): Observable<Categoria | any> {
    return this.usuarioService.token$.pipe(
      switchMap((token: string | null) => {
        if (!token) {
          throw new Error("No hay token disponible");
        }
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<Categoria | any>(url_servidor + "/api/categorias/obtener/" + idCategoria, { headers });
      })
    );
  }
}


