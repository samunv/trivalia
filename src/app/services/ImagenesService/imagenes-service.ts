import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { UsuarioService } from '../UsuarioService/usuario-service';
import { url_servidor } from '../../urlServidor';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  token?: string;

  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }

  obtenerImgApiKey(): Observable<string> {
    return this.usuarioService.token$.pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<{ api_key: string }>(url_servidor + "/imagenes/img-api-key", { headers })
          .pipe(
            map(response => response.api_key)
          )
      }),

    );
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
