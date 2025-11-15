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
  private preguntaService = inject(PreguntaService);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  // ==================== SIGNALS ====================
  usuario: Signal<Usuario> = this.usuarioService.usuario;
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
  preguntaActual = computed(() => this.preguntas()[this.preguntaIndex()] || null);

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
      }
      if (this.temporizadorFinalizado()) {
        this.fallarPorTiempoFinalizado()
      }
    });
  }

  // ==================== CICLO DE VIDA ====================
  ngOnInit() {
    this.inicializarJuego();
  }

  ngOnDestroy() {
    this.categoriaService.setCategoria(null);
  }

  // ==================== INICIALIZACIÓN ====================
  private inicializarJuego() {
    if (!this.categoriaService.categoria()) {
      console.log("No hay categoría seleccionada");
      this.navegar("/jugar");
      return;
    }
    this.categoriaTitulo.set(String(this.categoria().titulo));
    this.obtenerPreguntas(Number(this.categoria().idCategoria));
  }

  private obtenerPreguntas(idCategoria: number) {
    this.preguntaService.obtenerPreguntas(idCategoria).subscribe({
      next: preguntas => this.preguntas.set(preguntas),
      error: err => console.error("Error al cargar preguntas:", err)
    });
  }

  // ==================== VERIFICACIÓN DE RESPUESTA ====================
  verificarRespuesta(respuesta: string) {
    console.log(respuesta + " idPregunta: " + this.preguntaActual().idPregunta)
    const pregunta = this.preguntaActual();
    if (!pregunta) return;
    if (this.inputEscribir && this.inputFocusActivado()) {
      this.inputFocusActivado.set(false)
    }
    this.respuestaSeleccionada.set(respuesta.toLowerCase().trim());
    this.preguntaService.responderPregunta({ idPregunta: Number(this.preguntaActual().idPregunta), respuestaSeleccionada: respuesta } as RespuestaUsuario)
      .subscribe((resultado: ResultadoRespuestaRespondida) => {
        this.temporizadorPausado.set(true);
        this.mensaje.set(String(resultado.mensaje));
        this.esCorrecta.set(resultado.esCorrecta);
        setTimeout(() => { this.mensaje.set(""); this.esCorrecta.set(undefined) }, 1000)
        this.usuarioService.updateUsuarioSignal("vidas", resultado.usuarioActualizado?.vidas)
        this.usuarioService.updateUsuarioSignal("estrellas", resultado.usuarioActualizado?.estrellas)
        this.usuarioService.updateUsuarioSignal("idsPreguntasGanadas", resultado.usuarioActualizado?.idsPreguntasGanadas)
        this.usuarioService.updateUsuarioSignal("cantidadPreguntasFalladas", resultado.usuarioActualizado?.cantidadPreguntasFalladas)
        this.respuestaInput.set("")

        if (resultado.continuar) {
          setTimeout(() => { this.respuestaSeleccionada.set(""), this.aumentarIndexPregunta() }, 1000)
        } else {
          setTimeout(() => {
            this.turnoPerdido.set(true)
          }, 1000);

        }


      })
  }


  // ==================== LOGICA ACIERTO / FALLO ====================


  private fallarPorTiempoFinalizado() {
    this.esCorrecta.set(false);
    this.mensaje.set(`Has perdido el turno por tiempo...`);
    this.temporizadorFinalizado.set(false)
    setTimeout(() => { this.turnoPerdido.set(true), this.mensaje.set("") }, 1500);
  }


  // ==================== CONTINUAR CON MONEDAS ====================
  continuarConMonedas(cantidadMonedas: number) {
    const uid = this.usuario()?.uid;
    if (!uid) return;

    this.categoriaService.continuarConMonedas(uid).subscribe(
      (respuesta: RespuestaServidor) => {
        if (respuesta.resultado == true) {
          this.usuarioService.updateUsuarioSignal("monedas", (Number(this.usuario()?.monedas) - 100))
          this.turnoPerdido.set(false);
          this.aumentarIndexPregunta();
          this.respuestaSeleccionada.set("")
        }else{
          this.mensaje.set("No tienes monedas suficientes")
          setTimeout(() => this.navegar("/categoria/"+this.categoria().idCategoria), 1500);
        }
      }
    )

    // if (this.monedasDisponibles() >= cantidadMonedas) {
    //   const monedasRestantes = this.monedasDisponibles() - cantidadMonedas;
    //   //this.usuarioService.updateUsuario("monedas", monedasRestantes)
    //   this.usuarioService.actualizarItemUsuarioConClaveValor("monedas", monedasRestantes)
    //     .subscribe({ next: () => { }, error: err => console.error(err) });

    //   this.turnoPerdido.set(false);
    //   this.aumentarIndexPregunta();
    // } else {
    //   this.mensaje.set("No tienes monedas suficientes");
    //   setTimeout(() => this.navegar("/jugar"), 1500);
    // }
  }

  // ==================== NAVEGACIÓN ====================
  private aumentarIndexPregunta() {

    if (this.preguntaIndex() < this.preguntas().length - 1) {
      this.preguntaIndex.update(i => i + 1);
      // Reiniciar temporizador y volver a declararlo como false en un segundo
      this.reiniciarTemporizador.set(true);
      this.temporizadorPausado.set(false);
      setInterval(() => { this.reiniciarTemporizador.set(false) }, 1000)

    } else {
      this.finalizarPartida();
    }

  }

  private finalizarPartida() {
    this.finPartida.set(true);
    this.ganarPartida.set(true);
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  // ==================== HELPERS ====================

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
