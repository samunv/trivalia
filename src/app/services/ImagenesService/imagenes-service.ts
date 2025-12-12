import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { url_servidor } from '../../urlServidor';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {
  constructor(private http: HttpClient) { }


  obtenerImgApiKey(): Observable<string> {

    return this.http.get<{ api_key: string }>(url_servidor + "/api/imagenes/img-api-key")
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
