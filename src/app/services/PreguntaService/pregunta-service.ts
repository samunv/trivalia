import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Pregunta } from '../../interfaces/Pregunta';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './../../interfaces/Usuario';
import { UsuarioService } from '../UsuarioService/usuario-service';
import { Observable, switchMap } from 'rxjs';
import { url_servidor } from '../../urlServidor';
import { ResultadoRespuestaRespondida } from '../../interfaces/ResultadoRespuestaRespondida';
import { RespuestaUsuario } from '../../interfaces/RespuestaUsuario';
import { JwtGlobalStoreService } from '../Global/JWTGlobalStoreService/jwt-global-store-service';
import { UsuarioGlobalStoreService } from '../Global/UsuarioGlobalStoreService/usuario-global-store-service';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {

  private usuarioStoreService: UsuarioGlobalStoreService = inject(UsuarioGlobalStoreService);
  private usuario: Signal<Usuario> = this.usuarioStoreService.usuario;
  private jwtStoreServie: JwtGlobalStoreService = inject(JwtGlobalStoreService)
  private JWToken = this.jwtStoreServie.token

  constructor(private http: HttpClient) { }


  headers = new HttpHeaders({
    "Authorization": `Bearer ${this.JWToken()}`
  })


  obtenerPreguntas(idCategoria: number | any): Observable<Pregunta[] | any> {

    const headers = new HttpHeaders({
      "Authorization": `Bearer ${this.JWToken()}`
    })
    return this.http.get<Pregunta[] | any>(url_servidor + "/api/preguntas/obtener/" + idCategoria + "/" + 15, { headers })

  }


  obtenerPreguntasDificiles(arrayIdPreguntas: number[] | any[]): Observable<Pregunta[] | any> {

    const headers = new HttpHeaders({
      "Authorization": `Bearer ${this.JWToken()}`
    })
    return this.http.post<Pregunta[] | any[]>(
      url_servidor + "/api/preguntas/obtener-dificiles",
      arrayIdPreguntas,
      { headers }

    )
  }

  obtenerPreguntaGeneradaPorIA(): Observable<Pregunta> {
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${this.JWToken()}`
    })
    return this.http.get<Pregunta>(url_servidor + "/api/preguntas/obtener-pregunta-ia", { headers })
  }

  responderPregunta(respuestaUsuario: RespuestaUsuario): Observable<ResultadoRespuestaRespondida> {
    console.log("Respuesta usuario >>"+respuestaUsuario.respuestaSeleccionada)
    return this.http.post<ResultadoRespuestaRespondida>(url_servidor + "/api/preguntas/responder/" + this.usuario().uid,
      respuestaUsuario ,
      {
        headers: {
          "Authorization": "Bearer " + this.JWToken()
        }
      })
  }

}
