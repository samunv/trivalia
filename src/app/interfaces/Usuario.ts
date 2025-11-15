import { RegaloInterface } from "./RegaloInterface";

export interface Usuario {
  uid?: string;
  nombre?: string,
  email?: string;
  fotoURL?: string | null;
  estrellas?: number;
  monedas?: number;
  vidas?: number;
  idsPreguntasGanadas?: number[],
  cantidadPreguntasFalladas?: number,
  fechaUltimoRegalo?: Date
  cantidadPartidasGanadas?: number,
  regaloDisponible?: boolean
}
