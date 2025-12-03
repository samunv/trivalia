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
import { PartidaService } from '../../services/PartidaService/partida-service';
import { map, Observable } from 'rxjs';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { TextoH1 } from '../../components/texto-h1/texto-h1';

@Component({
  selector: 'app-pregunta-ia',
  imports: [Header, MainLayout, Item, Espacio, BotonGeneral, CommonModule, Modal, TextoH1],
  templateUrl: './pregunta-ia.html',
  styleUrl: './pregunta-ia.css'
})
export class PreguntaIa {

  private preguntaService: PreguntaService = inject(PreguntaService);
  private usuarioService: UsuarioService = inject(UsuarioService);
  private partidaService: PartidaService = inject(PartidaService);
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

  private obtenerPreguntaIA() {
    this.partidaComenzada.set(true);
    this.preguntaService.obtenerPreguntaGeneradaPorIA().subscribe((pregunta: Pregunta) => {
      this.pregunta.set(pregunta);
      const opciones: string[] = [];
      opciones.push(String(pregunta.opcion_a), String(pregunta.opcion_b), String(pregunta.opcion_c));
      this.opcionesPregunta.set(opciones);
    })

  }

  jugarIA(uid: string | any): void {
    this.partidaService.jugarIA(uid).subscribe(
      (resultado: RespuestaServidor) => {
        if (resultado.resultado == true) {
          this.obtenerPreguntaIA()
          this.restarMonedasUsuario(this.calcularCostoSegunMonedasUsuario())
        } else {
          alert("No tienes monedas suficientes para jugar.")
        }
      }
    )
  }

  verificarRespuesta(opcionSeleccionada: string) {
    this.respuestaSeleccionada.set(true);
    if (String(this.pregunta()?.respuesta_correcta) === opcionSeleccionada) {
      this.ganar()
    } else {
      this.mensaje.set("Incorrecto, respuesta correcta: " + this.pregunta()?.respuesta_correcta)
      this.esCorrecta.set(false)
    }
    setTimeout(() => {
      this.finPartida.set(true);
      this.mensaje.set("");
    }, 1500);

  }

  ganar() {
    this.mensaje.set("¡Correcto!");
    this.esCorrecta.set(true);
    this.partidaService.ganarPartidaIA(String(this.usuario().uid)).subscribe(
      (resultado: RespuestaServidor) => {
        if (resultado.resultado == true) {
          setTimeout(() => {
            this.usuarioService.updateUsuarioSignal("monedas", Number(this.usuario().monedas) + this.calcularRecompensaSegunMonedasUsuario());
            this.usuarioService.updateUsuarioSignal("estrellas", Number(this.usuario().estrellas) + 30);
            this.usuarioService.updateUsuarioSignal("regaloDisponible", true);
          }, 1500)
        }
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
    this.jugarIA(String(this.usuario().uid))
  }

  restarMonedasUsuario(cantidadMonedas: number): void {
    this.usuarioService.updateUsuarioSignal("monedas", Number(this.usuario().monedas) - cantidadMonedas)
  }


  calcularCostoSegunMonedasUsuario(): number {
    if (this.usuario().monedas as number < 1000) {
      return 300;
    }
    if (this.usuario().monedas as number >= 1000 && this.usuario().monedas as number <= 4000) {
      return 650;
    }
    if (this.usuario().monedas as number >= 5000) {
      return Math.round((this.usuario().monedas as number) / 4)
    }
    return 0;
  }

  calcularRecompensaSegunMonedasUsuario(): number {
    if (this.usuario().monedas as number < 1000) {
      return 400;
    }
    if (this.usuario().monedas as number >= 1000 && this.usuario().monedas as number <= 4000) {
      return 750;
    }
    if (this.usuario().monedas as number >= 5000) {
      return Math.round((this.usuario().monedas as number) / 4)+500;
    }
    return 0;
  }


}
