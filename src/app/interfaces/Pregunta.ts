export interface Pregunta {
  id_pregunta?: number,
  id_categoria?: number,
  pregunta?: string,
  tipo_pregunta?: "OPCIONES" | "ESCRIBIR" | "VF",
  dificultad?: "FACIL" | "MEDIO" | "DIFICIL",
  imagenURL?: string,
  respuesta_correcta?: string,
  opcion_a?: string,
  opcion_b?: string,
  opcion_c?: string
}
