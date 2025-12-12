import { Injectable, signal, WritableSignal } from '@angular/core';
import { Categoria } from '../../../interfaces/Categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaGlobalStoreService {


  private categoriaSignal = signal<string | any>(sessionStorage.getItem("categoriaSeleccionada") || null);
  public readonly categoria = this.categoriaSignal.asReadonly();

  private cantidadPreguntasSignal = signal<number | any>(sessionStorage.getItem("cantidadPreguntas"));
  public readonly cantidadPreguntas = this.cantidadPreguntasSignal.asReadonly();

   setCantidadPreguntas(cantidadPreguntas: number | null) {
      sessionStorage.setItem('cantidadPreguntas', JSON.stringify(cantidadPreguntas));
      this.cantidadPreguntasSignal.set(cantidadPreguntas);
    }


  setCategoria(categoriaSeleccionada: Categoria | null) {
      sessionStorage.setItem('categoriaSeleccionada', JSON.stringify(categoriaSeleccionada));
      this.categoriaSignal.set(categoriaSeleccionada);
    }


}
