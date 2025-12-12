import { Component, computed, inject, Signal, signal } from '@angular/core';
import { CategoriaService } from '../../services/CategoriaService/categoria-service';
import { Categoria } from '../../interfaces/Categoria';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MainLayout } from './../../layout/main-layout/main-layout';
import { Header } from '../../layout/header/header';
import { TextoH1 } from '../../components/texto-h1/texto-h1';
import { BotonGeneral } from '../../components/boton-general/boton-general';
import { Espacio } from '../../components/espacio/espacio';
import { PreguntaService } from '../../services/PreguntaService/pregunta-service';
import { map, Observable } from 'rxjs';
import { Pregunta } from '../../interfaces/Pregunta';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
import { MensajeAlerta } from '../../components/mensaje-alerta/mensaje-alerta';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { PartidaService } from '../../services/PartidaService/partida-service';
import { UsuarioGlobalStoreService } from '../../services/Global/UsuarioGlobalStoreService/usuario-global-store-service';
import { CategoriaGlobalStoreService } from '../../services/Global/CategoriaGlobalStoreService/categoria-global-store-service';
@Component({
  selector: 'app-pre-juego',
  imports: [MainLayout, Header, TextoH1, BotonGeneral, RouterLink, CommonModule, Espacio, MensajeAlerta],
  templateUrl: './pre-juego.html',
  styleUrl: './pre-juego.css'
})
export class PreJuego {


  private partidaService: PartidaService = inject(PartidaService);
  private categoriaStoreService: CategoriaGlobalStoreService = inject(CategoriaGlobalStoreService)
  private usuarioStoreService: UsuarioGlobalStoreService = inject(UsuarioGlobalStoreService);
  usuario: Signal<Usuario> = this.usuarioStoreService.usuario;

  constructor(
    private categoriaService: CategoriaService, private rutaActiva: ActivatedRoute,
    private preguntaService: PreguntaService,
    private router: Router
  ) { }

  categoria = signal<Categoria | any>(null);
  preguntas = signal<Pregunta[] | any>([]);
  cantidadPreguntas = this.categoriaStoreService.cantidadPreguntas
  alerta = signal<boolean>(false);

  ngOnInit() {
    this.obtenerParametroIdCategoriaDeRutaActiva().subscribe(idCategoria => {
      this.obtenerCategoria(idCategoria);
      this.obtenerVistaPreviaPreguntas(idCategoria);
    });
  }

  obtenerParametroIdCategoriaDeRutaActiva(): Observable<number> {
    return this.rutaActiva.params.pipe(map((params: Params) => {
      return Number(params["idCategoria"]);
    }
    ))
  }

  obtenerCategoria(idCategoriaRuta: number) {
    this.categoriaService.obtenerCategoriaPorId(idCategoriaRuta)
      .subscribe((categoria: Categoria) => {
        this.categoria.set(categoria)
      });
  }

  obtenerVistaPreviaPreguntas(idCategoria: number) {
    this.preguntaService.obtenerPreguntas(idCategoria)
      .subscribe({
        next: (preguntas: Pregunta[]) => {
          this.preguntas.set(preguntas)
          this.categoriaStoreService.setCantidadPreguntas(preguntas.length)
        },
        error: (err) => {
          console.error('Error al cargar preguntas', err);
        }
      });
  }

  onJugar(): void {
    this.verificarVidas().subscribe({
      next: (puedeJugar: boolean) => {
        if (puedeJugar) {
          this.establecerCategoria(this.categoria());
          this.router.navigate(["/partida"]);
        } else {
          this.alerta.set(true);
          setTimeout(() => { this.alerta.set(false) }, 2000);
        }
      },
      error: (err) => {
        // Maneja errores de la llamada HTTP
        console.error("Error al verificar vidas:", err);
        // Podrías poner la alerta aquí también si hay error
        this.alerta.set(true);
        setTimeout(() => { this.alerta.set(false) }, 2000);
      }
    });
  }

  establecerCategoria(categoria: Categoria) {
    this.categoriaStoreService.setCategoria(categoria);
  }

  verificarVidas(): Observable<boolean> {

    return this.partidaService.jugarPartida(this.usuario().uid as string).pipe(
      map((respuesta: RespuestaServidor) => {
        if (respuesta.resultado) {
          return true;
        } else {
          return false;
        }
      })
    )
  }

}
