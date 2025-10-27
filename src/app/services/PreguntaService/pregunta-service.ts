import { computed, inject, Injectable, signal } from '@angular/core';
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

  private usuarioService = inject(UsuarioService);

  constructor(private http: HttpClient) { }

  token = computed(()=>this.usuarioService.token())


  obtenerVistaPreviaPreguntas(idCategoria: number | any): Observable<Pregunta[] | any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token()}`
    });

    return this.http.get<Pregunta[] | any>(url_servidor + "/api/preguntas/obtener-vista-previa/" + idCategoria, { headers })
  }

  obtenerPreguntas(idCategoria: number | any): Observable<Pregunta[] | any> {

    const headers = new HttpHeaders({
      "Authorization": `Bearer ${this.token()}`
    })
    return this.http.get<Pregunta[] | any>(url_servidor + "/api/preguntas/obtener/" + idCategoria + "/" + 15, { headers })

  }

  obtenerRespuestaCorrecta(idPregunta: number): Observable<string | any> {
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${this.token()}`
    })
    return this.http.get<{ respuesta_correcta: string }>(url_servidor + "/api/preguntas/obtener-respuesta-correcta/" + idPregunta, { headers })

  }

  obtenerPreguntasDificiles(arrayIdPreguntas: number[] | any[]): Observable<Pregunta[] | any> {

    const headers = new HttpHeaders({
      "Authorization": `Bearer ${this.token()}`
    })
    return this.http.post<Pregunta[] | any[]>(
      url_servidor + "/api/preguntas/obtener-dificiles",
      arrayIdPreguntas,
      { headers }

    )
  }

}
