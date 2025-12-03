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
  private usuarioService = inject(UsuarioService);

  private token: Signal<string> = this.usuarioService.token;

  jugarPartida(uid: string): Observable<RespuestaServidor> {
    return this.http.get<RespuestaServidor>(url_servidor + "/api/partida/jugar/" + uid, {
      headers:
        { "Authorization": "Bearer " + this.token() }
    })
  }

  continuarPartidaConMonedas(uid: string): Observable<RespuestaServidor> {
    return this.http.get<RespuestaServidor>(url_servidor + "/api/partida/continuar-con-monedas/" + uid, {
      headers:
        { "Authorization": "Bearer " + this.token() }
    })
  }

  jugarIA(uid: string): Observable<RespuestaServidor> {
    return this.http.get<RespuestaServidor>(url_servidor + "/api/partida/jugar-ia/" + uid, {
      headers:
        { "Authorization": "Bearer " + this.token() }
    })
  }

  ganarPartida(uid: string, pregunta: Pregunta): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(url_servidor + "/api/partida/ganar/" + uid, pregunta, {
      headers: { "Authorization": "Bearer " + this.token() }
    })
  }

  obtenerPrimeraPregunta(idCategoria: number): Observable<Pregunta> {
    return this.http.get<Pregunta>(url_servidor + "/api/partida/obtener-primera/" + idCategoria, {
      headers: { "Authorization": "Bearer " + this.token() }
    })
  }

  responderPregunta(respuestaUsuario: RespuestaUsuario, uid: string): Observable<ResultadoRespuestaRespondida> {
    console.log("Respuesta usuario >>" + respuestaUsuario.respuestaSeleccionada)
    return this.http.post<ResultadoRespuestaRespondida>(url_servidor + "/api/partida/responder-pregunta/" + uid,
      respuestaUsuario,
      {
        headers: {
          "Authorization": "Bearer " + this.token()
        }
      })
  }


  ganarPartidaIA(uid: string): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(url_servidor + "/api/partida/ganar-ia/" + uid, {}, {
      headers: {
        "Authorization": "Bearer " + this.token()
      }
    })
  }

  perderPorTiempo(uid: string): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(url_servidor + "/api/partida/perder-por-tiempo/" + uid, {}, {
      headers: {
        "Authorization": "Bearer " + this.token()
      }
    })
  }

  reintentarPartida(uid: string): Observable<RespuestaServidor> {
    return this.http.post<RespuestaServidor>(url_servidor + "/api/partida/reintentar-partida/" + uid, {}, {
      headers: {
        "Authorization": "Bearer " + this.token()
      }
    })
  }

}
