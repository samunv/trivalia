import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { Header } from '../../layout/header/header';
import { TextoH1 } from './../../components/texto-h1/texto-h1';
import { CategoriaService } from './../../services/CategoriaService/categoria-service';
import { Pregunta } from '../../interfaces/Pregunta';
import { PreguntaService } from './../../services/PreguntaService/pregunta-service';
import { Observable, of, switchMap } from 'rxjs';
import { Categoria } from '../../interfaces/Categoria';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BotonGeneral } from '../../components/boton-general/boton-general';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Modal } from '../../components/modal/modal';
import { Espacio } from "../../components/espacio/espacio";
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { random } from 'nanoid';

@Component({
  selector: 'app-pagina-preguntas',
  imports: [MainLayout, Header, TextoH1, CommonModule, BotonGeneral, ReactiveFormsModule, FormsModule, Modal, Espacio],
  templateUrl: './pagina-preguntas.html'
})

export class PaginaPreguntas {

  usuario?: Usuario;
  preguntas: Pregunta[] = [];
  idCategoria?: number;
  categoriaTitulo?: string | any;
  preguntaIndex: number = 0;
  preguntaRespondida: boolean = false;
  preguntaActual?: Pregunta;
  finPartida: boolean = false;
  mensaje: string = "";
  opcionesPregunta: string[] = [];
  respuestaCorrecta: string | any = "";
  respuestaSeleccionada: string = "";
  esCorrecta?: boolean;
  respuestaInput?: string = "";
  turnoPerdido?: boolean = false;

  constructor(private categoriaService: CategoriaService, private preguntaService: PreguntaService, private router: Router, private usuarioService: UsuarioService, private firestore: Firestore) { }

  ngOnInit() {
    this.comprobarCategoriaSeleccionada(this.categoriaService.categoriaSeleccionadaValue);
    this.obtenerCategoria();
    this.obtenerUsuario()
  }

  obtenerUsuario() {
    this.usuarioService.usuario$.subscribe((usuario: Usuario) => {
      this.usuario = usuario;
    })
  }

  obtenerCategoria() {
    this.categoriaService.categoriaSeleccionada$.subscribe(
      {
        next: (categoria: Categoria) => {
          this.categoriaTitulo = categoria.titulo;
          this.obtenerPreguntas(categoria.idCategoria);
        },
        error: (err) => {
          console.log("Error: " + err)
        }
      }
    )
  }

  comprobarCategoriaSeleccionada(categoriaSeleccionadaValue: Categoria | any) {
    // Cuando no haya categoria seleccionada sacar de la partida
    if (!categoriaSeleccionadaValue) {
      console.log("No hay partida activa");
      this.navegar("/jugar")
    }
  }


  obtenerPreguntas(idCategoria: number | any) {
    this.preguntaService.obtenerPreguntas(idCategoria).subscribe((preguntas: Pregunta[]) => {
      this.preguntas = preguntas;
      this.setPreguntaActual();
    })
  }


  setPreguntaActual() {
    this.preguntaActual = this.preguntas[this.preguntaIndex];
    console.log("Pregunta actual:", this.preguntaActual);
    this.obtenerOpciones(this.preguntaActual);

  }

  obtenerOpciones(preguntaActual: Pregunta) {
    if (preguntaActual) {
      if (preguntaActual.tipo_pregunta === "OPCIONES" || preguntaActual.tipo_pregunta === "VF") {
        this.opcionesPregunta = [preguntaActual.opcion_a, preguntaActual.opcion_b, preguntaActual.opcion_c]
          .filter(opt => opt)
          .map(opt => String(opt));
      }
    }
  }

  verificarRespuesta(respuesta: string | any) {
    if (!this.preguntaActual) return;
    this.respuestaSeleccionada = respuesta.toLowerCase().trim();
    this.obtenerRespuestaCorrecta(Number(this.preguntaActual?.idPregunta)).subscribe(
      (respuestaCorrecta) => {
        this.respuestaCorrecta = respuestaCorrecta;
        if (respuestaCorrecta.toLowerCase().trim() == this.respuestaSeleccionada) {
          this.acertarPregunta()
        } else {
          this.fallarPregunta()
        }
        this.resetear()
      });
  }

  obtenerRespuestaCorrecta(idPregunta: number): Observable<string | any> {
    return this.preguntaService.obtenerRespuestaCorrecta(idPregunta).pipe(
      switchMap(
        (mapaRespuestaCorrecta: { [clave: string]: string }) => {
          return of(mapaRespuestaCorrecta["respuesta_correcta"]);
        }))
  }

  acertarPregunta() {
    this.esCorrecta = true;
    this.mensaje = "¡Correcto! " + this.respuestaCorrecta.charAt(0).toLocaleUpperCase() + this.respuestaCorrecta.slice(1)
    this.ganarEstrellas()
  }

  fallarPregunta() {
    this.esCorrecta = false;
    this.mensaje = "¡Incorrecto! Respuesta correcta: " + this.respuestaCorrecta.charAt(0).toLocaleUpperCase() + this.respuestaCorrecta.slice(1)
    this.perderVida()
    setTimeout(() => this.turnoPerdido = true, 1500)
  }

  perderVida() {
    const vidasRestantes: number = Number(this.usuario?.vidas) - 1;
    this.usuarioService.actualizarItemsUsuario(String(this.usuario?.uid), undefined, vidasRestantes, undefined).subscribe({
      next: () => {
        this.usuarioService.setUsuario({
          ...this.usuario,
          vidas: vidasRestantes
        });
      },
      error: (err) => console.error("Error al actualizar:", err)
    })
  }


  resetear() {
    setTimeout(() => {
      if (!this.turnoPerdido) {
        this.aumentarIndexPregunta();
      }
      this.respuestaSeleccionada = ""; // reset
      this.respuestaCorrecta = ""; // reset
      this.mensaje = ""
      this.respuestaInput = ""

    }, 1500);
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  continuarConMonedas(cantidadMonedas: number) {

    if (Number(this.usuario?.monedas) >= cantidadMonedas) {
      const monedasRestantes: number = Number(this.usuario?.monedas) - cantidadMonedas;
      this.usuarioService.actualizarItemsUsuario(String(this.usuario?.uid), monedasRestantes, undefined, undefined).subscribe({
        next: () => {
          this.usuarioService.setUsuario({
            ...this.usuario,
            monedas: monedasRestantes,
          });
        },
        error: (err) => console.error("Error al actualizar:", err)
      }
      )

      this.turnoPerdido = false;
      this.aumentarIndexPregunta()
    } else {
      this.mensaje = "Vaya... no tienes monedas suficientes"
      setTimeout(() => this.navegar("/jugar"), 1000)
    }

  }



  aumentarIndexPregunta() {
    if (this.preguntaIndex < this.preguntas.length - 1) {
      this.preguntaIndex++;
      this.setPreguntaActual()
    } else {
      this.finPartida = true;
      this.mensaje = "Has finalizado la partida!"
    }
  }



  ganarEstrellas() {
    const estrellasUsuarioActuales: number = Number(this.usuario?.estrellas)
    const cantidadEstrellasTotales: number = this.estrellasSegunDificultad(this.preguntaActual?.dificultad) + estrellasUsuarioActuales;
    this.usuarioService.actualizarItemsUsuario(String(this.usuario?.uid), undefined, undefined, this.estrellasSegunDificultad(this.preguntaActual?.dificultad)).subscribe(
      {
        next: () => {
          console.log("Usuario actualizado");
          this.usuarioService.setUsuario({
            ...this.usuario,
            estrellas: cantidadEstrellasTotales
          })
        },
        error: (err) => console.error("Error al actualizar:", err)
      }
    )

  }

  estrellasSegunDificultad(
    dificultad: "DIFICIL" | "FACIL" | "MEDIO" | undefined
  ): number {
    switch (dificultad) {
      case "DIFICIL": return 30;
      case "MEDIO": return 20;
      case "FACIL": return 10;
      default: return 0;
    }
  }

  ngOnDestroy() {
    this.categoriaService.setCategoria(null);
  }

}
