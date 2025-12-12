import { RefreshToken } from "./RefreshToken";
import { RegaloInterface } from "./RegaloInterface";

export interface RespuestaServidor {
  exito?: string,
  error?: string,
  resultado?: boolean | string
}
