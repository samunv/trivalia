import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Pregunta } from '../../interfaces/Pregunta';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './../../interfaces/Usuario';
import { UsuarioService } from '../UsuarioService/usuario-service';
import { Observable, switchMap } from 'rxjs';
import { url_servidor } from '../../urlServidor';
import { ResultadoRespuestaRespondida } from '../../interfaces/ResultadoRespuestaRespondida';
import { RespuestaUsuario } from '../../interfaces/RespuestaUsuario';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {

  private usuarioService = inject(UsuarioService);

  constructor(private http: HttpClient) { }

  token = this.usuarioService.token;
  usuario: Signal<Usuario> = this.usuarioService.usuario;

  headers = new HttpHeaders({
    "Authorization": `Bearer ${this.token()}`
  })


  // obtenerVistaPreviaPreguntas(idCategoria: number | any): Observable<Pregunta[] | any> {
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${this.token()}`
  //   });

  //   return this.http.get<Pregunta[] | any>(url_servidor + "/api/preguntas/obtener-vista-previa/" + idCategoria, { headers })
  // }

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

  obtenerPreguntaGeneradaPorIA(): Observable<Pregunta> {
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${this.token()}`
    })
    return this.http.get<Pregunta>(url_servidor + "/api/preguntas/obtener-pregunta-ia", { headers })
  }

  responderPregunta(respuestaUsuario: RespuestaUsuario): Observable<ResultadoRespuestaRespondida> {
    console.log("Respuesta usuario >>"+respuestaUsuario.respuestaSeleccionada)
    return this.http.post<ResultadoRespuestaRespondida>(url_servidor + "/api/preguntas/responder/" + this.usuario().uid,
      respuestaUsuario ,
      {
        headers: {
          "Authorization": "Bearer " + this.token()
        }
      })
  }

}
