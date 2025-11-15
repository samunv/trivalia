import { RegaloInterface } from "./RegaloInterface";

export interface RespuestaServidor {
  exito?: string,
  token?:string,
  error?: string,
  regalo?:RegaloInterface,
  resultado?:boolean
}
