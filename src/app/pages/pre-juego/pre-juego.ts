import { Component } from '@angular/core';
import { CategoriaService } from '../../services/CategoriaService/categoria-service';
import { Categoria } from '../../interfaces/Categoria';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { MainLayout } from './../../layout/main-layout/main-layout';
import { Header } from '../../layout/header/header';
import { TextoH1 } from '../../components/texto-h1/texto-h1';
import { BotonGeneral } from '../../components/boton-general/boton-general';
import { Espacio } from '../../components/espacio/espacio';
import { PreguntaService } from '../../services/PreguntaService/pregunta-service';
import { Observable } from 'rxjs';
import { Pregunta } from '../../interfaces/Pregunta';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pre-juego',
  imports: [MainLayout, Header, TextoH1, BotonGeneral, RouterLink, CommonModule],
  templateUrl: './pre-juego.html',
  styleUrl: './pre-juego.css'
})
export class PreJuego {

  categoria?: Categoria | any;
  preguntas?: Pregunta[] | any;

  constructor(private categoriaService: CategoriaService, private rutaActiva: ActivatedRoute, private preguntaService: PreguntaService) { }

  ngOnInit() {
    this.rutaActiva.params.subscribe(params => {
      this.categoriaService.obtenerCategoriaPorId(params['idCategoria'])
        .subscribe((categoria: Categoria) => {
          this.categoria = categoria;

          // Suscribirse al observable de preguntas
          this.preguntaService.obtenerVistaPreviaPreguntas(categoria?.id_categoria)
            .subscribe({
              next: (preguntas: Pregunta[]) => {
                this.preguntas = preguntas;
              },
              error: (err) => {
                console.error('Error al cargar preguntas', err);
              }
            });
        });
    });
  }

}
