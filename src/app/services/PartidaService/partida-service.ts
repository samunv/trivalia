import { inject, Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { url_servidor } from '../../urlServidor';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './../UsuarioService/usuario-service';
import { Pregunta } from '../../interfaces/Pregunta';
import { RespuestaUsuario } from '../../interfaces/RespuestaUsuario';
import { ResultadoRespuestaRespondida } from '../../interfaces/ResultadoRespuestaRespondida';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {

  private http = inject(HttpClient);

  jugarPartida(uid: string): Observable<RespuestaServidor> {
    return this.http.get<RespuestaServidor>(url_servidor + "/api/partida/jugar/" + uid)
  }

  continuarPartidaConMonedas(uid: string): Observable<RespuestaServidor> {
    return this.http.get<RespuestaServidor>(url_servidor + "/api/partida/continuar-con-monedas/" + uid)
  }

  jugarIA(uid: string): Observable<RespuestaServidor> {
    return this.http.get<RespuestaServidor>(url_servidor + "/api/partida/jugar-ia/" + uid)
  }

  ganarPartida(uid: string, pregunta: Pregunta): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(url_servidor + "/api/partida/ganar/" + uid, pregunta)
  }

  obtenerPrimeraPregunta(idCategoria: number): Observable<Pregunta> {
    return this.http.get<Pregunta>(url_servidor + "/api/partida/obtener-primera/" + idCategoria)
  }

  responderPregunta(respuestaUsuario: RespuestaUsuario, uid: string): Observable<ResultadoRespuestaRespondida> {
    console.log("Respuesta usuario >>" + respuestaUsuario.respuestaSeleccionada)
    return this.http.post<ResultadoRespuestaRespondida>(url_servidor + "/api/partida/responder-pregunta/" + uid,
      respuestaUsuario)
  }


  perderPorTiempo(uid: string): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(url_servidor + "/api/partida/perder-por-tiempo/" + uid, {})
  }

  reintentarPartida(uid: string): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(url_servidor + "/api/partida/reintentar-partida/" + uid, {})
  }

  responderIA(uid: string, respuestaUsuario: RespuestaUsuario): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(url_servidor + "/api/partida/responder-ia/" + uid,
      respuestaUsuario)
  }

}
