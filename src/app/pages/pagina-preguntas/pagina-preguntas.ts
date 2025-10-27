import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { Header } from '../../layout/header/header';
import { TextoH1 } from './../../components/texto-h1/texto-h1';
import { CategoriaService } from './../../services/CategoriaService/categoria-service';
import { Pregunta } from '../../interfaces/Pregunta';
import { PreguntaService } from './../../services/PreguntaService/pregunta-service';
import { Observable, of } from 'rxjs';
import { Categoria } from '../../interfaces/Categoria';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BotonGeneral } from '../../components/boton-general/boton-general';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Modal } from '../../components/modal/modal';
import { Espacio } from "../../components/espacio/espacio";
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
import { AudioComponent } from '../../components/audio-component/audio-component';
import { toSignal } from '@angular/core/rxjs-interop';

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
    AudioComponent
  ],
  templateUrl: './pagina-preguntas.html'
})
export class PaginaPreguntas implements OnInit {
  private categoriaService = inject(CategoriaService);
  private preguntaService = inject(PreguntaService);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  // Signals - Estado reactivo de Angular nativo
  usuario = computed(() => this.usuarioService.usuario());
  preguntas = signal<Pregunta[]>([]);
  preguntaIndex = signal(0);
  categoriaTitulo = signal<string>('');
  categoria = computed(() => this.categoriaService.categoria())

  // Estado de la pregunta actual
  respuestaSeleccionada = signal<string>('');
  respuestaCorrecta = signal<string>('');
  respuestaInput = signal<string>('');
  esCorrecta = signal<boolean | undefined>(undefined);
  mensaje = signal<string>('');

  // Estado del juego
  finPartida = signal(false);
  turnoPerdido = signal(false);

  // Computed signals - valores derivados automáticamente
  preguntaActual = computed(() => {
    const preguntas = this.preguntas();
    const index = this.preguntaIndex();
    return preguntas[index];
  });

  opcionesPregunta = computed(() => {
    const pregunta = this.preguntaActual();
    if (!pregunta) return [];

    if (pregunta.tipo_pregunta === "OPCIONES" || pregunta.tipo_pregunta === "VF") {
      return [pregunta.opcion_a, pregunta.opcion_b, pregunta.opcion_c]
        .filter(opt => opt)
        .map(opt => String(opt));
    }
    return [];
  });

  vidasRestantes = computed(() => Number(this.usuario()?.vidas) || 0);
  monedasDisponibles = computed(() => Number(this.usuario()?.monedas) || 0);

  puedeJugar = computed(() => this.vidasRestantes() > 0);

  // Effect - Reaccionar a cambios automáticamente
  constructor() {
    // Validar vidas automáticamente
    effect(() => {
      if (this.usuario() && this.vidasRestantes() <= 0) {
        this.mensaje.set("¡Te has quedado sin vidas!");
        setTimeout(() => this.navegar("/jugar"), 2000);
      }
    });
  }

  ngOnInit() {
    this.inicializarJuego();
  }

  // ==================== INICIALIZACIÓN ====================

  private inicializarJuego() {
    const categoriaActual = this.categoriaService.categoria();

    if (!categoriaActual) {
      console.log("No hay categoría seleccionada");
      this.navegar("/jugar");
      return;
    }

    if (!this.puedeJugar()) {
      this.mensaje.set("No tienes vidas suficientes");
      setTimeout(() => this.navegar("/jugar"), 2000);
      return;
    }

    this.obtenerCategoria();
  }

  private obtenerCategoria() {
    this.categoriaTitulo.set(String(this.categoria().titulo));
    this.obtenerPreguntas(Number(this.categoria().idCategoria));
  }

  private obtenerPreguntas(idCategoria: number) {
    this.preguntaService.obtenerPreguntas(idCategoria).subscribe({
      next: (preguntas: Pregunta[]) => {
        this.preguntas.set(preguntas);
      },
      error: (err) => console.error("Error al cargar preguntas:", err)
    });
  }

  // ==================== VERIFICACIÓN DE RESPUESTA ====================

  verificarRespuesta(respuesta: string) {
    const pregunta = this.preguntaActual();
    if (!pregunta) return;

    this.respuestaSeleccionada.set(respuesta.toLowerCase().trim());

    this.obtenerRespuestaCorrecta(Number(pregunta.idPregunta)).subscribe({
      next: (respuestaCorrecta) => {
        this.respuestaCorrecta.set(respuestaCorrecta);
        const esCorrecta = respuestaCorrecta.toLowerCase().trim() === this.respuestaSeleccionada();

        if (esCorrecta) {
          this.acertarPregunta();
        } else {
          this.fallarPregunta();
        }

        this.resetear();
      },
      error: (err) => console.error("Error al verificar respuesta:", err)
    });
  }

  private obtenerRespuestaCorrecta(idPregunta: number): Observable<string> {
    return new Observable(subscriber => {
      this.preguntaService.obtenerRespuestaCorrecta(idPregunta).subscribe({
        next: (mapaRespuesta: { [clave: string]: string }) => {
          subscriber.next(mapaRespuesta["respuesta_correcta"] || "");
          subscriber.complete();
        },
        error: (err) => subscriber.error(err)
      });
    });
  }

  // ==================== LÓGICA DE ACIERTO/FALLO ====================

  private acertarPregunta() {
    this.esCorrecta.set(true);
    this.mensaje.set(`¡Correcto! ${this.capitalizarPrimeraLetra(this.respuestaCorrecta())}`);

    const usuario = this.usuario();
    const pregunta = this.preguntaActual();

    if (!usuario || !pregunta) return;

    const yaGanada = usuario.arrayIdPreguntasGanadas?.includes(Number(pregunta.idPregunta));

    if (!yaGanada) {
      this.ganarEstrellas();
      this.actualizarPreguntasGanadasDelUsuario(Number(pregunta.idPregunta));
    }
  }

  private fallarPregunta() {
    this.esCorrecta.set(false);
    this.mensaje.set(`¡Incorrecto! Respuesta correcta: ${this.capitalizarPrimeraLetra(this.respuestaCorrecta())}`);

    this.perderVida();
    this.actualizarPreguntasFalladas();

    setTimeout(() => {
      this.turnoPerdido.set(true);
    }, 1500);
  }

  // ==================== ACTUALIZACIÓN DE USUARIO ====================

  private actualizarPreguntasGanadasDelUsuario(idPregunta: number) {
    const usuario = this.usuario();
    if (!usuario?.uid) return;

    this.usuarioService.actualizarArrayPreguntasJugadas(String(usuario.uid), idPregunta).subscribe({
      next: () => {
        this.usuarioService.setUsuario({
          ...usuario,
          arrayIdPreguntasGanadas: [
            ...(usuario.arrayIdPreguntasGanadas || []),
            idPregunta
          ]
        });
      },
      error: (err) => console.error("Error al actualizar preguntas ganadas:", err)
    });
  }

  private perderVida() {
    const usuario = this.usuario();
    if (!usuario?.uid) return;

    const vidasRestantes = this.vidasRestantes() - 1;

    this.usuarioService.actualizarItemsUsuario(
      String(usuario.uid),
      undefined,
      vidasRestantes,
      undefined
    ).subscribe({
      next: () => {
        this.usuarioService.setUsuario({
          ...usuario,
          vidas: vidasRestantes
        });

        if (vidasRestantes <= 0) {
          this.mensaje.set("¡Game Over! Te quedaste sin vidas");
          this.finPartida.set(true);
          setTimeout(() => this.navegar("/jugar"), 2000);
        }
      },
      error: (err) => console.error("Error al perder vida:", err)
    });
  }

  private ganarEstrellas() {
    const usuario = this.usuario();
    const pregunta = this.preguntaActual();

    if (!usuario?.uid || !pregunta) return;

    const estrellasGanadas = this.estrellasSegunDificultad(pregunta.dificultad);
    const estrellasTotales = Number(usuario.estrellas) + estrellasGanadas;

    this.usuarioService.actualizarItemsUsuario(
      String(usuario.uid),
      undefined,
      undefined,
      estrellasGanadas
    ).subscribe({
      next: () => {
        this.usuarioService.setUsuario({
          ...usuario,
          estrellas: estrellasTotales
        });
      },
      error: (err) => console.error("Error al ganar estrellas:", err)
    });
  }

  private actualizarPreguntasFalladas() {
    const usuario = this.usuario();
    if (!usuario?.uid) return;

    this.usuarioService.actualizarPreguntasFalladas(String(usuario.uid));
    this.usuarioService.setUsuario({
      ...usuario,
      preguntasFalladas: (Number(usuario.preguntasFalladas) + 1)
    });
  }

  // ==================== CONTINUAR CON MONEDAS ====================

  continuarConMonedas(cantidadMonedas: number) {
    const usuario = this.usuario();
    if (!usuario?.uid) return;

    if (this.monedasDisponibles() >= cantidadMonedas) {
      const monedasRestantes = this.monedasDisponibles() - cantidadMonedas;

      this.usuarioService.actualizarItemsUsuario(
        String(usuario.uid),
        monedasRestantes,
        undefined,
        undefined
      ).subscribe({
        next: () => {
          this.usuarioService.setUsuario({
            ...usuario,
            monedas: monedasRestantes
          });
          this.turnoPerdido.set(false);
          this.aumentarIndexPregunta();
        },
        error: (err) => console.error("Error al continuar con monedas:", err)
      });
    } else {
      this.mensaje.set("No tienes monedas suficientes");
      setTimeout(() => this.navegar("/jugar"), 1500);
    }
  }

  // ==================== NAVEGACIÓN Y UTILIDADES ====================

  private aumentarIndexPregunta() {
    const totalPreguntas = this.preguntas().length;
    const indexActual = this.preguntaIndex();

    if (indexActual < totalPreguntas - 1) {
      this.preguntaIndex.update(i => i + 1);
    } else {
      this.finPartida.set(true);
      this.mensaje.set("¡Has finalizado la partida!");
    }
  }

  private resetear() {
    setTimeout(() => {
      if (!this.turnoPerdido()) {
        this.aumentarIndexPregunta();
      }

      this.respuestaSeleccionada.set("");
      this.respuestaCorrecta.set("");
      this.mensaje.set("");
      this.respuestaInput.set("");
    }, 1500);
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  // ==================== HELPERS ====================

  private estrellasSegunDificultad(
    dificultad: "DIFICIL" | "FACIL" | "MEDIO" | undefined
  ): number {
    const ESTRELLAS: Record<string, number> = {
      DIFICIL: 30,
      MEDIO: 20,
      FACIL: 10
    };

    return ESTRELLAS[dificultad || "FACIL"] || 0;
  }

  private capitalizarPrimeraLetra(texto: string): string {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  ngOnDestroy() {
    this.categoriaService.setCategoria(null);
  }
}
