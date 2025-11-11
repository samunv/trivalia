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

@Component({
  selector: 'app-pregunta-ia',
  imports: [Header, MainLayout, Item, Espacio, BotonGeneral, CommonModule, Modal],
  templateUrl: './pregunta-ia.html',
  styleUrl: './pregunta-ia.css'
})
export class PreguntaIa {

  private preguntaService: PreguntaService = inject(PreguntaService);
  private usuarioService: UsuarioService = inject(UsuarioService);

  constructor() { }

  pregunta: WritableSignal<Pregunta | null> = signal<Pregunta | null>(null);
  opcionesPregunta: WritableSignal<string[]> = signal<string[]>([]);
  mensaje: WritableSignal<string> = signal<string>("");
  respuestaSeleccionada: WritableSignal<boolean> = signal<boolean>(false);
  esCorrecta: WritableSignal<boolean> = signal<boolean>(false);
  partidaComenzada: WritableSignal<boolean> = signal<boolean>(false);
  finPartida: WritableSignal<boolean> = signal<boolean>(false);
  usuario: Signal<Usuario>= this.usuarioService.usuario;

  obtenerPreguntaIA() {
    this.partidaComenzada.set(true);
    this.preguntaService.obtenerPreguntaGeneradaPorIA().subscribe((pregunta: Pregunta) => {
      this.pregunta.set(pregunta);
      const opciones: string[] = [];
      opciones.push(String(pregunta.opcion_a), String(pregunta.opcion_b), String(pregunta.opcion_c));
      this.opcionesPregunta.set(opciones);
    })
  }

  verificarRespuesta(opcionSeleccionada: string) {
    this.respuestaSeleccionada.set(true);
    if (String(this.pregunta()?.respuesta_correcta) === opcionSeleccionada) {
      this.mensaje.set("¡Correcto!");
      this.esCorrecta.set(true);
    } else {
      this.mensaje.set("Incorrecto, respuesta correcta: " + this.pregunta()?.respuesta_correcta);
      this.esCorrecta.set(false);
    }
    this.finPartida.set(true);
  }

  actualizarPreguntasGanadasUsuario(){
    this.usuarioService.actualizarArrayPreguntasJugadas(Number(this.pregunta()?.idPregunta)).subscribe(
      {
        next: () => {
          this.usuarioService.updateUsuario("arrayIdPreguntasGanadas", [...this.usuario().arrayIdPreguntasGanadas!, 0]);
        },
        error: (error) => {console.error("Error al actualizar preguntas jugadas del usuario:", error);}
      }
    )
  }

}
