import { Component, OnInit, OnDestroy, inject, signal, computed, effect, WritableSignal, ViewChild, ElementRef, AfterViewChecked, Signal } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { Header } from '../../layout/header/header';
import { CategoriaService } from './../../services/CategoriaService/categoria-service';
import { Pregunta } from '../../interfaces/Pregunta';
import { PreguntaService } from './../../services/PreguntaService/pregunta-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BotonGeneral } from '../../components/boton-general/boton-general';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Modal } from '../../components/modal/modal';
import { Espacio } from "../../components/espacio/espacio";
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { AudioComponent } from '../../components/audio-component/audio-component';
import { map, Observable } from 'rxjs';
import { TemporizadorComponent } from '../../components/temporizador-component/temporizador-component';
import { Item } from '../../components/item/item';
import { FinPartida } from '../fin-partida/fin-partida';
import { ResultadoRespuestaRespondida } from '../../interfaces/ResultadoRespuestaRespondida';
import { RespuestaUsuario } from '../../interfaces/RespuestaUsuario';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { Categoria } from '../../interfaces/Categoria';
import { Usuario } from '../../interfaces/Usuario';
import { PartidaService } from '../../services/PartidaService/partida-service';
import { UsuarioGlobalStoreService } from '../../services/Global/UsuarioGlobalStoreService/usuario-global-store-service';


@Component({
  selector: 'app-pagina-preguntas',
  imports: [
    MainLayout,
    Header,
    CommonModule,
    BotonGeneral,
    ReactiveFormsModule,
    FormsModule,
    Modal,
    Espacio,
    AudioComponent,
    TemporizadorComponent,
    Item,
    FinPartida,
    ReactiveFormsModule
  ],
  templateUrl: './pagina-preguntas.html'
})
export class PaginaPreguntas implements OnInit, OnDestroy, AfterViewChecked {
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private partidaService: PartidaService = inject(PartidaService);
  private usuarioStoreService: UsuarioGlobalStoreService = inject(UsuarioGlobalStoreService);
  usuario: Signal<Usuario> = this.usuarioStoreService.usuario;

  preguntas = signal<Pregunta[]>([]);
  preguntaIndex = signal(0);
  categoriaTitulo = signal('');
  categoria: Signal<Categoria> = this.categoriaService.categoria;

  respuestaSeleccionada = signal('');
  respuestaCorrecta = signal('');
  respuestaInput = signal('');
  esCorrecta = signal<boolean | undefined>(undefined);
  mensaje = signal('');
  finPartida = signal(false);
  ganarPartida = signal(false);
  turnoPerdido = signal(false);
  reiniciarTemporizador = signal<boolean>(false);
  temporizadorFinalizado = signal<boolean>(false);
  temporizadorPausado = signal<boolean>(false);
  permitirContinuar = signal<boolean | undefined>(false);

  // ==================== COMPUTED ====================
  preguntaActual: WritableSignal<Pregunta | undefined> = signal<Pregunta | undefined>(undefined)

  opcionesPregunta = computed(() => {
    const pregunta = this.preguntaActual();
    if (!pregunta) return [];
    if (pregunta.tipo_pregunta === 'OPCIONES' || pregunta.tipo_pregunta === 'VF') {
      return [pregunta.opcion_a, pregunta.opcion_b, pregunta.opcion_c].filter(opt => opt).map(String);
    }
    return [];
  });

  vidasRestantes = computed(() => Number(this.usuario()?.vidas) || 0);
  monedasDisponibles = computed(() => Number(this.usuario()?.monedas) || 0);
  puedeJugar = computed(() => this.vidasRestantes() > 0);

  @ViewChild('inputEscribir') inputEscribir!: ElementRef<HTMLInputElement>;
  inputFocusActivado = signal<boolean>(false);

  // ==================== EFFECTS ====================
  constructor() {
    // Mostrar mensaje si se quedan sin vidas
    effect(() => {
      if (this.usuario() && this.vidasRestantes() <= 0) {
        this.mensaje.set("¡Te has quedado sin vidas!");
        this.navegar("/categoria/" + this.categoria(
        ).idCategoria)
      }
      if (this.temporizadorFinalizado()) {
        this.fallarPorTiempoFinalizado()
      }
    });
  }

  ngOnInit() {
    this.inicializarJuego();
  }

  ngOnDestroy() {
    this.categoriaService.setCategoria(null);
  }

  private inicializarJuego() {
    if (!this.categoriaService.categoria()) {
      console.log("No hay categoría seleccionada");
      this.navegar("/jugar");
      return;
    }
    this.categoriaTitulo.set(String(this.categoria().titulo));
    //this.obtenerPreguntas(Number(this.categoria().idCategoria));
    this.obtenerPrimeraPregunta(Number(this.categoria().idCategoria))

  }

  private obtenerPrimeraPregunta(idCategoria: number) {
    this.preguntaIndex.set(1)
    this.partidaService.obtenerPrimeraPregunta(idCategoria).subscribe(
      (pregunta) => {
        this.preguntaActual.set(pregunta)
      }
    )
  }

  verificarRespuesta(respuesta: string) {
    this.verificarInput();
    this.temporizadorPausado.set(true);
    this.respuestaSeleccionada.set(respuesta.toLowerCase().trim());
    this.partidaService.responderPregunta({ idPregunta: Number(this.preguntaActual()!.idPregunta), idCategoria: Number(this.categoria().idCategoria), respuestaSeleccionada: respuesta } as RespuestaUsuario, String(this.usuario().uid))
      .subscribe((resultado: ResultadoRespuestaRespondida) => {
        this.onResponder(resultado)
      })
  }

  private verificarInput() {
    if (this.inputEscribir && this.inputFocusActivado()) {
      this.inputFocusActivado.set(false)
    }
  }

  private onResponder(resultado: ResultadoRespuestaRespondida) {
    if (resultado != null) {
      this.mensajeTrasResponder(String(resultado.mensaje), Boolean(resultado.esCorrecta))
      this.limpiarMensajesEInteracciones()
      this.actualizarUsuarioPorPreguntaRespondida(resultado);
      if (!resultado.siguientePregunta && resultado.continuar) {
        setTimeout(() => { this.finalizarPartida(); }, 1000);
      }
      if (resultado.continuar) {
        this.continuar(resultado);
      } else {
        setTimeout(() => {
          this.turnoPerdido.set(true);
        }, 1000);
      }
    } else {
      this.fallarPorTiempoFinalizado()
    }
  }

  private limpiarMensajesEInteracciones() {
    setTimeout(() => { this.mensaje.set(""); this.esCorrecta.set(undefined) }, 1000);
    this.respuestaInput.set("");
  }

  private mensajeTrasResponder(mensaje: string, esCorrecta: boolean) {
    this.mensaje.set(mensaje);
    this.esCorrecta.set(esCorrecta);
  }

  private continuar(resultado: ResultadoRespuestaRespondida) {
    setTimeout(() => {
      this.respuestaSeleccionada.set(""),
      this.preguntaActual.set(resultado.siguientePregunta ? resultado.siguientePregunta : undefined);
      this.preguntaIndex.set(Number(resultado.preguntaIndex));
      this.reiniciarTemporizador.set(true)
      this.temporizadorPausado.set(false)
    }, 1000);
  }


  private fallarPorTiempoFinalizado() {
    this.mensajeTrasResponder(`Has perdido el turno por tiempo...`, false)
    this.temporizadorFinalizado.set(false)
    setTimeout(() => { this.turnoPerdido.set(true), this.mensaje.set("") }, 1000);
    this.partidaService.perderPorTiempo(String(this.usuario().uid)).subscribe(
      (respuesta) => {
        if (respuesta.resultado == true) {
          this.usuarioStoreService.updateUsuarioSignal("vidas", Number(this.usuario().vidas) - 1)
        } else {
          alert("Error en el servidor")
        }

      }
    )

  }


  reintentar() {
    const uid = this.usuario()?.uid;
    if (!uid) return;
    this.turnoPerdido.set(false);
    this.respuestaSeleccionada.set("")
    this.temporizadorPausado.set(false)
    this.reiniciarTemporizador.set(true)
    this.partidaService.reintentarPartida(String(this.usuario().uid)).subscribe()
  }


  private finalizarPartida() {

    this.ganar(this.usuario().uid as string, this.preguntaActual()!).subscribe(
      (resultadoGanar: boolean) => {
        if (resultadoGanar === true) {
          this.finPartida.set(true);
          this.ganarPartida.set(true);
          this.actualizarUsuarioGanador();
          this.temporizadorPausado.set(true);
        }
      }
    );

  }


  private ganar(uid: string, pregunta: Pregunta): Observable<boolean> {
    return this.partidaService.ganarPartida(uid, pregunta).pipe(
      map(
        (respuesta: RespuestaServidor) => {
          return respuesta.resultado as boolean;
        }
      )
    )

  }

  private actualizarUsuarioGanador(): void {
    this.usuarioStoreService.updateUsuarioSignal("regaloDisponible", true);
    this.usuarioStoreService.updateUsuarioSignal("cantidadPartidasGanadas", Number(this.usuario().cantidadPartidasGanadas) + 1)
    this.usuarioStoreService.updateUsuarioSignal("monedas", this.usuario().monedas as number + 100)
  }

  private actualizarUsuarioPorPreguntaRespondida(resultado: ResultadoRespuestaRespondida) {
    this.usuarioStoreService.updateUsuarioSignal("vidas", resultado.usuarioActualizado?.vidas);
    this.usuarioStoreService.updateUsuarioSignal("estrellas", resultado.usuarioActualizado?.estrellas);
    this.usuarioStoreService.updateUsuarioSignal("idsPreguntasGanadas", resultado.usuarioActualizado?.idsPreguntasGanadas);
    this.usuarioStoreService.updateUsuarioSignal("cantidadPreguntasFalladas", resultado.usuarioActualizado?.cantidadPreguntasFalladas);
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  onTemporizadorTerminado(terminado: boolean) {
    if (terminado) {
      this.temporizadorFinalizado.set(true)
    }
  }


  ngAfterViewChecked() {
    if (this.inputEscribir && !this.inputFocusActivado()) {
      setTimeout(() => {
        this.inputEscribir.nativeElement.focus();
        this.inputFocusActivado.set(true);
      }, 1000);
    }
  }
}
