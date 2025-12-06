import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { UsuarioService } from '../UsuarioService/usuario-service';
import { url_servidor } from '../../urlServidor';
import { JwtGlobalStoreService } from '../Global/JWTGlobalStoreService/jwt-global-store-service';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  private usuarioService = inject(UsuarioService);
  private jwtStoreServie: JwtGlobalStoreService = inject(JwtGlobalStoreService)
  private JWToken = this.jwtStoreServie.token

  constructor(private http: HttpClient) { }


  obtenerImgApiKey(): Observable<string> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.JWToken()}`
    });
    return this.http.get<{ api_key: string }>(url_servidor + "/api/imagenes/img-api-key", { headers })
      .pipe(
        map(response => response.api_key)
      )
  }


  enviarImagen(formData: FormData): Observable<any> {
    return this.obtenerImgApiKey().pipe(
      switchMap((apiKey: string) => {
        formData.append("key", apiKey);
        return this.http.post<any>('https://api.imgbb.com/1/upload', formData);
      })
    );
  }
}
