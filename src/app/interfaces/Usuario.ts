import { RegaloInterface } from "./RegaloInterface";


export interface Usuario {
  uid?: string;
  nombre?: string,
  codigo_usuario?: string;
  email?: string;
  fotoURL?: string | null;
  creadoEn?: any | null;
  estrellas?: number;
  monedas?: number;
  vidas?: number;
  logros?: string[];
  arrayIdPreguntasGanadas?: number[],
  preguntasFalladas?: number,
  fechaUltimoRegalo?: Date
}
