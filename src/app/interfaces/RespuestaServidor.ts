import { RefreshToken } from "./RefreshToken";
import { RegaloInterface } from "./RegaloInterface";

export interface RespuestaServidor {
  exito?: string,
  token?:string,
  refreshTokenObj: RefreshToken,
  error?: string,
  resultado?:boolean
}
