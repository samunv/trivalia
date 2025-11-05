import { Component, OnInit, OnDestroy, inject, signal, computed, effect, WritableSignal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { Header } from '../../layout/header/header';
import { CategoriaService } from './../../services/CategoriaService/categoria-service';
import { Pregunta } from '../../interfaces/Pregunta';
import { PreguntaService } from './../../services/PreguntaService/pregunta-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BotonGeneral } from '../../components/boton-general/boton-general';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Modal } from '../../components/modal/modal';
import { Espacio } from "../../components/espacio/espacio";
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { AudioComponent } from '../../components/audio-component/audio-component';
import { Observable } from 'rxjs';
import { TemporizadorComponent } from '../../components/temporizador-component/temporizador-component';
import { Item } from '../../components/item/item';
import { FinPartida } from '../fin-partida/fin-partida';


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
  usuario = this.usuarioService.usuario;
  preguntas = signal<Pregunta[]>([]);
  preguntaIndex = signal(0);
  categoriaTitulo = signal('');
  categoria = this.categoriaService.categoria;

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
    const pregunta = this.preguntaActual();
    if (!pregunta) return;
    if (this.inputEscribir && this.inputFocusActivado()) {
      this.inputFocusActivado.set(false)
    }

    this.respuestaSeleccionada.set(respuesta.toLowerCase().trim());

    this.obtenerRespuestaCorrecta(Number(pregunta.idPregunta)).subscribe({
      next: respuestaCorrecta => {
        this.respuestaCorrecta.set(respuestaCorrecta);
        const acierto = respuestaCorrecta.toLowerCase().trim() === this.respuestaSeleccionada();
        acierto ? this.acertarPregunta() : this.fallarPregunta();
        this.resetear();
      },
      error: err => console.error("Error al verificar respuesta:", err)
    });
  }

  private obtenerRespuestaCorrecta(idPregunta: number): Observable<string> {
    return new Observable(subscriber => {
      this.preguntaService.obtenerRespuestaCorrecta(idPregunta).subscribe({
        next: data => { subscriber.next(data.respuesta_correcta || ''); subscriber.complete(); },
        error: err => subscriber.error(err)
      });
    });
  }

  // ==================== LOGICA ACIERTO / FALLO ====================
  private acertarPregunta() {
    this.temporizadorPausado.set(true)
    this.esCorrecta.set(true);
    this.mensaje.set(`¡Correcto! ${this.capitalizarPrimeraLetra(this.respuestaCorrecta()!)}`);

    const usuario = this.usuario();
    const pregunta = this.preguntaActual();
    if (!usuario || !pregunta) return;

    const yaGanada = usuario.arrayIdPreguntasGanadas?.includes(Number(pregunta.idPregunta));
    if (!yaGanada) {
      this.ganarEstrellas();
      this.actualizarPreguntasGanadas(Number(pregunta.idPregunta));
    }
  }

  private fallarPregunta() {
    this.esCorrecta.set(false);
    this.mensaje.set(`¡Incorrecto! Respuesta correcta: ${this.capitalizarPrimeraLetra(this.respuestaCorrecta()!)}`);
    this.perderVida();
    this.actualizarPreguntasFalladas();
    this.temporizadorPausado.set(true);

    setTimeout(() => this.turnoPerdido.set(true), 1500);

  }

  private fallarPorTiempoFinalizado() {
    this.esCorrecta.set(false);
    this.mensaje.set(`Has perdido el turno por tiempo...`);
    this.perderVida();
    this.temporizadorFinalizado.set(false)
    setTimeout(() => { this.turnoPerdido.set(true), this.mensaje.set("") }, 1500);
  }

  // ==================== ACTUALIZACIÓN USUARIO ====================
  private ganarEstrellas() {
    const pregunta = this.preguntaActual();
    if (!pregunta || !this.usuario()?.uid) return;

    const estrellasGanadas = this.estrellasSegunDificultad(pregunta.dificultad);
    this.usuarioService.updateUsuario("estrellas", (this.usuario().estrellas || 0) + estrellasGanadas)
    this.usuarioService.actualizarItemUsuarioConClaveValor(
      "estrellas", estrellasGanadas
    ).subscribe({ next: () => { }, error: err => console.error(err) });
  }

  private perderVida() {
    const uid = this.usuario()?.uid;
    if (!uid) return;

    const vidasRestantes = this.vidasRestantes() - 1;
    this.usuarioService.updateUsuario("vidas", vidasRestantes);

    if (vidasRestantes <= 0) {
      this.mensaje.set("¡Game Over! Te quedaste sin vidas");
      this.finPartida.set(true);
      setTimeout(() => this.navegar("/jugar"), 2000);
    }

    this.usuarioService.actualizarItemUsuarioConClaveValor("vidas", vidasRestantes)
      .subscribe({ next: () => { }, error: err => console.error(err) });
  }

  private actualizarPreguntasGanadas(idPregunta: number) {
    const uid = this.usuario()?.uid;
    if (!uid) return;
    this.usuarioService.updateUsuario("arrayIdPreguntasGanadas", [...(this.usuario().arrayIdPreguntasGanadas || []), idPregunta]);
    this.usuarioService.actualizarArrayPreguntasJugadas(idPregunta)
      .subscribe({ next: () => { }, error: err => console.error(err) });
  }

  private actualizarPreguntasFalladas() {
    const uid = this.usuario()?.uid;
    if (!uid) return;
    this.usuarioService.updateUsuario("preguntasFalladas", Number((this.usuario().preguntasFalladas || 0) + 1))
    this.usuarioService.actualizarPreguntasFalladas()
  }

  // ==================== CONTINUAR CON MONEDAS ====================
  continuarConMonedas(cantidadMonedas: number) {
    const uid = this.usuario()?.uid;
    if (!uid) return;

    if (this.monedasDisponibles() >= cantidadMonedas) {
      const monedasRestantes = this.monedasDisponibles() - cantidadMonedas;
      this.usuarioService.updateUsuario("monedas", monedasRestantes)
      this.usuarioService.actualizarItemUsuarioConClaveValor("monedas", monedasRestantes)
        .subscribe({ next: () => { }, error: err => console.error(err) });

      this.turnoPerdido.set(false);
      this.aumentarIndexPregunta();
    } else {
      this.mensaje.set("No tienes monedas suficientes");
      setTimeout(() => this.navegar("/jugar"), 1500);
    }
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

  private resetear() {
    setTimeout(() => {
      if (!this.turnoPerdido()) this.aumentarIndexPregunta();

      this.respuestaSeleccionada.set('');
      this.respuestaCorrecta.set('');
      this.mensaje.set('');
      this.respuestaInput.set('');
    }, 1500);
  }


  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  // ==================== HELPERS ====================
  private estrellasSegunDificultad(dificultad?: 'FACIL' | 'MEDIO' | 'DIFICIL'): number {
    return { FACIL: 10, MEDIO: 20, DIFICIL: 30 }[dificultad || 'FACIL'] || 0;
  }

  onTemporizadorTerminado(terminado: boolean) {
    if (terminado) {
      this.temporizadorFinalizado.set(true)
    }
  }

  private capitalizarPrimeraLetra(texto: string) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
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
