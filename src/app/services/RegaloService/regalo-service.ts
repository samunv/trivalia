import { inject, Injectable, Signal } from '@angular/core';
import { UsuarioService } from './../UsuarioService/usuario-service';
import { Observable } from 'rxjs';
import { RegaloInterface } from '../../interfaces/RegaloInterface';
import { HttpClient } from '@angular/common/http';
import { url_servidor } from '../../urlServidor';

@Injectable({
  providedIn: 'root'
})
export class RegaloService {
  private usuarioService: UsuarioService = inject(UsuarioService);
  private http: HttpClient = inject(HttpClient);
  private token: Signal<string> = this.usuarioService.token;
  
  constructor() {
  }

  abrirRegalo(uid: string): Observable<RegaloInterface> {
    return this.http.get<RegaloInterface>(url_servidor + "/api/regalos/abrir/" + uid,
      { headers: { "Authorization": "Bearer " + this.token() } }
    )
  }

}
