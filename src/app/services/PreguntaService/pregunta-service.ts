import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Pregunta } from '../../interfaces/Pregunta';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './../../interfaces/Usuario';
import { UsuarioService } from '../UsuarioService/usuario-service';
import { Observable, switchMap } from 'rxjs';
import { url_servidor } from '../../urlServidor';
import { ResultadoRespuestaRespondida } from '../../interfaces/ResultadoRespuestaRespondida';
import { RespuestaUsuario } from '../../interfaces/RespuestaUsuario';
import { UsuarioGlobalStoreService } from '../Global/UsuarioGlobalStoreService/usuario-global-store-service';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {

  private usuarioStoreService: UsuarioGlobalStoreService = inject(UsuarioGlobalStoreService);
  private usuario: Signal<Usuario> = this.usuarioStoreService.usuario;

  constructor(private http: HttpClient) { }


  obtenerPreguntas(idCategoria: number | any): Observable<Pregunta[] | any> {


    return this.http.get<Pregunta[] | any>(url_servidor + "/api/preguntas/obtener/" + idCategoria + "/" + 15)

  }


  obtenerPreguntasDificiles(arrayIdPreguntas: number[] | any[]): Observable<Pregunta[] | any> {


    return this.http.post<Pregunta[] | any[]>(
      url_servidor + "/api/preguntas/obtener-dificiles",
      arrayIdPreguntas

    )
  }

  obtenerPreguntaGeneradaPorIA(dificultad: "DIFICIL" | "FACIL" | "MEDIO"): Observable<Pregunta> {

    return this.http.post<Pregunta>(url_servidor + "/api/preguntas/obtener-pregunta-ia", { "dificultad": dificultad })
  }

  responderPregunta(respuestaUsuario: RespuestaUsuario): Observable<ResultadoRespuestaRespondida> {
    console.log("Respuesta usuario >>" + respuestaUsuario.respuestaSeleccionada)
    return this.http.post<ResultadoRespuestaRespondida>(url_servidor + "/api/preguntas/responder/" + this.usuario().uid,
      respuestaUsuario)
  }

}
