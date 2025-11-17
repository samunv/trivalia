import { inject, Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { url_servidor } from '../../urlServidor';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from './../UsuarioService/usuario-service';

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

}
