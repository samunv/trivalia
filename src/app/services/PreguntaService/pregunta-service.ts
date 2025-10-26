import { Injectable } from '@angular/core';
import { Pregunta } from '../../interfaces/Pregunta';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './../../interfaces/Usuario';
import { UsuarioService } from '../UsuarioService/usuario-service';
import { Observable, switchMap } from 'rxjs';
import { url_servidor } from '../../urlServidor';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {
  preguntas?: Pregunta[]

  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }

  obtenerVistaPreviaPreguntas(idCategoria: number | any): Observable<Pregunta[] | any> {
    return this.usuarioService.token$.pipe(
      switchMap((token: string | any) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<Pregunta[] | any>(url_servidor + "/api/preguntas/obtener-vista-previa/" + idCategoria, { headers })
      })
    )
  }

  obtenerPreguntas(idCategoria: number | any): Observable<Pregunta[] | any> {
    return this.usuarioService.token$.pipe(
      switchMap((token: string) => {
        const headers = new HttpHeaders({
          "Authorization": `Bearer ${token}`
        })
        return this.http.get<Pregunta[] | any>(url_servidor + "/api/preguntas/obtener/" + idCategoria + "/" + 15, {headers})
      })
    )
  }

  obtenerRespuestaCorrecta(idPregunta: number): Observable<string | any>{
    return this.usuarioService.token$.pipe(switchMap((token: string)=>{
      const headers = new HttpHeaders({
        "Authorization": `Bearer ${token}`
      })
      return this.http.get<{[clave: string]: string}>(url_servidor + "/api/preguntas/obtener-respuesta-correcta/"+idPregunta, {headers})
    }))
  }
}
