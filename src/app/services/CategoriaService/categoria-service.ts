import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
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

  constructor(private http: HttpClient) { }


  obtenerCategorias(): Observable<Categoria[] | any> {


    return this.http.get<Categoria[] | any>(url_servidor + "/api/categorias/todo");
  }

  obtenerCategoriaPorId(idCategoria: number): Observable<Categoria | any> {
    return this.http.get<Categoria | any>(url_servidor + "/api/categorias/obtener/" + idCategoria);
  }


}



