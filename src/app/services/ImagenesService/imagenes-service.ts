
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  constructor(private http: HttpClient) { }

  apiKey: string = "073e2140389f28522575e128cc60ab5b"

  enviarImagen(formData: FormData): Observable<any> {
    formData.append("key", this.apiKey)
    return this.http.post<any>('https://api.imgbb.com/1/upload', formData)
  }
}


