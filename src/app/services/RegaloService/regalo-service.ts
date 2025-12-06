import { inject, Injectable, Signal } from '@angular/core';
import { UsuarioService } from './../UsuarioService/usuario-service';
import { Observable } from 'rxjs';
import { RegaloInterface } from '../../interfaces/RegaloInterface';
import { HttpClient } from '@angular/common/http';
import { url_servidor } from '../../urlServidor';
import { JwtGlobalStoreService } from '../Global/JWTGlobalStoreService/jwt-global-store-service';

@Injectable({
  providedIn: 'root'
})
export class RegaloService {
  private http: HttpClient = inject(HttpClient);
  private jwtStoreServie: JwtGlobalStoreService = inject(JwtGlobalStoreService)
  private JWToken = this.jwtStoreServie.token

  constructor() {
  }

  abrirRegalo(uid: string): Observable<RegaloInterface> {
    return this.http.get<RegaloInterface>(url_servidor + "/api/regalos/abrir/" + uid,
      { headers: { "Authorization": "Bearer " + this.JWToken() } }
    )
  }

}
