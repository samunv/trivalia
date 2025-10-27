import { Component, computed, signal } from '@angular/core';
import { CategoriaService } from '../../services/CategoriaService/categoria-service';
import { Categoria } from '../../interfaces/Categoria';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MainLayout } from './../../layout/main-layout/main-layout';
import { Header } from '../../layout/header/header';
import { TextoH1 } from '../../components/texto-h1/texto-h1';
import { BotonGeneral } from '../../components/boton-general/boton-general';
import { Espacio } from '../../components/espacio/espacio';
import { PreguntaService } from '../../services/PreguntaService/pregunta-service';
import { Observable } from 'rxjs';
import { Pregunta } from '../../interfaces/Pregunta';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
import { MensajeAlerta } from '../../components/mensaje-alerta/mensaje-alerta';
@Component({
  selector: 'app-pre-juego',
  imports: [MainLayout, Header, TextoH1, BotonGeneral, RouterLink, CommonModule, Espacio, MensajeAlerta],
  templateUrl: './pre-juego.html',
  styleUrl: './pre-juego.css'
})
export class PreJuego {

  constructor(
    private categoriaService: CategoriaService, private rutaActiva: ActivatedRoute,
    private preguntaService: PreguntaService, private usuarioService: UsuarioService,
    private router: Router
  ) { }

  categoria = signal<Categoria | any>(null);
  preguntas = signal<Pregunta[] | any>([]);
  cantidadPreguntas = signal<number>(0);
  usuario = computed(() => this.usuarioService.usuario());
  alerta = signal<boolean>(false);

  ngOnInit() {
    this.rutaActiva.params.subscribe(params => {
      this.categoriaService.obtenerCategoriaPorId(params['idCategoria'])
        .subscribe((categoria: Categoria) => {
          this.categoria.set(categoria)

          // Suscribirse al observable de preguntas
          this.preguntaService.obtenerVistaPreviaPreguntas(categoria?.idCategoria)
            .subscribe({
              next: (preguntas: Pregunta[]) => {
                this.preguntas.set(preguntas)
                this.cantidadPreguntas.set(preguntas.length)
              },
              error: (err) => {
                console.error('Error al cargar preguntas', err);
              }
            });
        });
    });
  }

  onJugar(): void {
    this.categoriaService.setCategoria(this.categoria());
    if (this.verificarVidas(this.usuario()?.vidas)) {
      this.router.navigate(["/partida"])
    } else {
      this.alerta.set(true);
      setTimeout(() => { this.alerta.set(false) }, 2000)
    }

  }

  verificarVidas(vidasUsuario: number | any): boolean {
    return vidasUsuario > 0;
  }

}
