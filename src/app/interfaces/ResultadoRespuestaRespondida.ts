import { Usuario } from "./Usuario";

export interface ResultadoRespuestaRespondida {
  esCorrecta?: boolean,
  mensaje?: string,
  itemAfectado?: "estrellas" | "vidas" | "monedas",
  cantidadItemAfectado?: number,
  continuar?: boolean,
  usuarioActualizado?: Usuario
}
