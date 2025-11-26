import { Usuario } from "./Usuario";
import { Pregunta } from './Pregunta';

export interface ResultadoRespuestaRespondida {
  esCorrecta?: boolean,
  mensaje?: string,
  itemAfectado?: "estrellas" | "vidas" | "monedas",
  cantidadItemAfectado?: number,
  continuar?: boolean,
  usuarioActualizado?: Usuario
  siguientePregunta?: Pregunta,
  preguntaIndex?: number
}
