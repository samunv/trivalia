import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Header } from '../../layout/header/header';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { Item } from '../../components/item/item';
import { Espacio } from '../../components/espacio/espacio';
import { PreguntaService } from '../../services/PreguntaService/pregunta-service';
import { Pregunta } from '../../interfaces/Pregunta';
import { BotonGeneral } from '../../components/boton-general/boton-general';
import { CommonModule } from '@angular/common';
import { Modal } from '../../components/modal/modal';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pregunta-ia',
  imports: [Header, MainLayout, Item, Espacio, BotonGeneral, CommonModule, Modal],
  templateUrl: './pregunta-ia.html',
  styleUrl: './pregunta-ia.css'
})
export class PreguntaIa {

  private preguntaService: PreguntaService = inject(PreguntaService);
  private usuarioService: UsuarioService = inject(UsuarioService);
  private router: Router = inject(Router);

  constructor() { }

  pregunta: WritableSignal<Pregunta | null> = signal<Pregunta | null>(null);
  opcionesPregunta: WritableSignal<string[]> = signal<string[]>([]);
  mensaje: WritableSignal<string> = signal<string>("");
  respuestaSeleccionada: WritableSignal<boolean> = signal<boolean>(false);
  esCorrecta: WritableSignal<boolean> = signal<boolean>(false);
  partidaComenzada: WritableSignal<boolean> = signal<boolean>(false);
  finPartida: WritableSignal<boolean> = signal<boolean>(false);
  usuario: Signal<Usuario> = this.usuarioService.usuario;

  obtenerPreguntaIA() {
    if (Number(this.usuario().monedas) >= 300) {
      this.restarMonedasUsuario(300);
      this.partidaComenzada.set(true);
      this.preguntaService.obtenerPreguntaGeneradaPorIA().subscribe((pregunta: Pregunta) => {
        this.pregunta.set(pregunta);
        const opciones: string[] = [];
        opciones.push(String(pregunta.opcion_a), String(pregunta.opcion_b), String(pregunta.opcion_c));
        this.opcionesPregunta.set(opciones);
      })
    } else {
      alert("No tienes suficientes monedas para jugar a Trival-IA.");
      this.router.navigate(['/jugar']);
    }
  }

  verificarRespuesta(opcionSeleccionada: string) {
    this.respuestaSeleccionada.set(true);
    if (String(this.pregunta()?.respuesta_correcta) === opcionSeleccionada) {
      this.ganar()
    } else {
      this.fallar()
    }
    setTimeout(() => {
      this.finPartida.set(true);
      this.mensaje.set("");
    }, 1500);

  }

  ganar() {
    this.mensaje.set("¡Correcto!");
    this.esCorrecta.set(true);
    setTimeout(() => {
      this.aumentarMonedasUsuario(400);
      this.aumentarEstrellasUsuario(30);
    }, 1500);


  }

  fallar() {
    this.mensaje.set("Incorrecto, respuesta correcta: " + this.pregunta()?.respuesta_correcta);
    this.esCorrecta.set(false);
    setTimeout(() => {
      this.restarVidasUsuario(1);
    }, 1500);

  }

  actualizarPreguntasGanadasUsuario() {
    this.usuarioService.actualizarArrayPreguntasJugadas(Number(this.pregunta()?.idPregunta)).subscribe(
      {
        next: () => {
          // this.usuarioService.updateUsuario("arrayIdPreguntasGanadas", [...this.usuario().arrayIdPreguntasGanadas!, 0]);
        },
        error: (error) => { console.error("Error al actualizar preguntas jugadas del usuario:", error); }
      }
    )
  }

  salir() {
    this.router.navigate(['/jugar']);
  }

  intentarDeNuevo() {
    this.pregunta.set(null);
    this.obtenerPreguntaIA()
    this.finPartida.set(false);
    this.mensaje.set("");
    this.respuestaSeleccionada.set(false);
    this.esCorrecta.set(false);
  }

  aumentarMonedasUsuario(cantidadMonedas: number): void {
    const totalMonedas: number = this.usuario().monedas! + cantidadMonedas;
    this.usuarioService.actualizarItemUsuarioConClaveValor("monedas", totalMonedas).subscribe(() => {
      //this.usuarioService.updateUsuario("monedas", totalMonedas);
    }
    )
  }

  aumentarEstrellasUsuario(cantidadEstrellas: number): void {
    const totalEstrellas: number = this.usuario().estrellas! + cantidadEstrellas;
    this.usuarioService.actualizarItemUsuarioConClaveValor("estrellas", totalEstrellas).subscribe(() => {
      //this.usuarioService.updateUsuario("estrellas", totalEstrellas);
    }
    )
  }

  restarVidasUsuario(cantidadVidas: number): void {
    const totalVidas: number = this.usuario().vidas! - cantidadVidas;
    this.usuarioService.actualizarItemUsuarioConClaveValor("vidas", totalVidas).subscribe(() => {
      //this.usuarioService.updateUsuario("vidas", totalVidas);
    }
    );
  }

  restarMonedasUsuario(cantidadMonedas: number): void {
    const totalMonedas: number = this.usuario().monedas! - cantidadMonedas;
    this.usuarioService.actualizarItemUsuarioConClaveValor("monedas", totalMonedas).subscribe();
  }






}
