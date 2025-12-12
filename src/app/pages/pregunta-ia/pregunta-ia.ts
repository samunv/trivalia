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
import { Usuario } from '../../interfaces/Usuario';
import { Router } from '@angular/router';
import { PartidaService } from '../../services/PartidaService/partida-service';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { TextoH1 } from '../../components/texto-h1/texto-h1';
import { RespuestaUsuario } from '../../interfaces/RespuestaUsuario';
import { TemporizadorComponent } from '../../components/temporizador-component/temporizador-component';
import { UsuarioGlobalStoreService } from '../../services/Global/UsuarioGlobalStoreService/usuario-global-store-service';

@Component({
  selector: 'app-pregunta-ia',
  imports: [Header, MainLayout, Item, Espacio, BotonGeneral, CommonModule, Modal, TextoH1, TemporizadorComponent],
  templateUrl: './pregunta-ia.html',
  styleUrl: './pregunta-ia.css'
})
export class PreguntaIa {

  private preguntaService: PreguntaService = inject(PreguntaService);
  private partidaService: PartidaService = inject(PartidaService);
  private router: Router = inject(Router);
  private usuarioStoreService: UsuarioGlobalStoreService = inject(UsuarioGlobalStoreService);
  usuario: Signal<Usuario> = this.usuarioStoreService.usuario;

  constructor() { }

  pregunta: WritableSignal<Pregunta | null> = signal<Pregunta | null>(null);
  opcionesPregunta: WritableSignal<string[]> = signal<string[]>([]);
  mensaje: WritableSignal<string> = signal<string>("");
  respuestaSeleccionada: WritableSignal<boolean> = signal<boolean>(false);
  esCorrecta: WritableSignal<boolean> = signal<boolean>(false);
  partidaComenzada: WritableSignal<boolean> = signal<boolean>(false);
  finPartida: WritableSignal<boolean> = signal<boolean>(false);
  temporizadorFinalizado: WritableSignal<boolean> = signal<boolean>(false);
  pausarTemporizador: WritableSignal<boolean> = signal<boolean>(false);
  dificultadesArray : string[] = ["MEDIO", "FACIL", "DIFICIL"];
  dificultadSeleccionada: WritableSignal<string> = signal<string>("MEDIO");

  private obtenerPreguntaIA() {
    this.partidaComenzada.set(true);
    this.preguntaService.obtenerPreguntaGeneradaPorIA(this.dificultadSeleccionada() as "DIFICIL" | "FACIL" | "MEDIO").subscribe((pregunta: Pregunta) => {
      this.pregunta.set(pregunta);
      const opciones: string[] = [];
      opciones.push(String(pregunta.opcion_a), String(pregunta.opcion_b), String(pregunta.opcion_c));
      this.opcionesPregunta.set(opciones);
    })

  }

  handleSeleccionarDificultad(event: any) {
    this.dificultadSeleccionada.set(event.target.value);
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
    this.pausarTemporizador.set(true)
    const respuestaUsuario: RespuestaUsuario = { idPregunta: this.pregunta()?.idPregunta, respuestaSeleccionada: opcionSeleccionada }
    this.partidaService.responderIA(String(this.usuario().uid), respuestaUsuario).subscribe(
      (respuesta: RespuestaServidor) => {
        if (respuesta.resultado !== null || respuesta.resultado !== "null") {
          if (respuesta.resultado === opcionSeleccionada) {
            this.ganar()
          } else {
            this.mensaje.set("Incorrecto. Respuesta correcta: " + respuesta.resultado)
            this.esCorrecta.set(false)
          }
        }

        setTimeout(() => {
          this.finPartida.set(true);
          this.mensaje.set("");
        }, 1500);
      }
    )
  }

  onTemporizadorTerminado(temporizadorTerminado: boolean) {
    if (temporizadorTerminado == true) {
      this.esCorrecta.set(false);
      this.mensaje.set("¡Has perdido por tiempo!")
      setTimeout(() => { this.finPartida.set(true); this.mensaje.set("") }, 1500)
    }
  }

  private ganar() {
    this.mensaje.set("¡Correcto!");
    this.esCorrecta.set(true);
    setTimeout(() => {
      this.usuarioStoreService.updateUsuarioSignal("monedas", Number(this.usuario().monedas) + this.calcularRecompensaSegunMonedasUsuario());
      this.usuarioStoreService.updateUsuarioSignal("estrellas", Number(this.usuario().estrellas) + 30);
      this.usuarioStoreService.updateUsuarioSignal("regaloDisponible", true);
    }, 1500)
  }


  salir() {
    this.router.navigate(['/jugar']);
  }


  restarMonedasUsuario(cantidadMonedas: number): void {
    this.usuarioStoreService.updateUsuarioSignal("monedas", Number(this.usuario().monedas) - cantidadMonedas)
  }


  calcularCostoSegunMonedasUsuario(): number {
    if (this.usuario().monedas as number < 1000) {
      return 300;
    }
    if (this.usuario().monedas as number >= 1000 && this.usuario().monedas as number <= 5000) {
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
    if (this.usuario().monedas as number >= 1000 && this.usuario().monedas as number <= 5000) {
      return 750;
    }
    if (this.usuario().monedas as number >= 5000) {
      return Math.round((this.usuario().monedas as number) / 4) + 500;
    }
    return 0;
  }


}
