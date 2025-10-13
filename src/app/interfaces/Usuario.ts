export interface Usuario {
  uid?: string;
  codigo_usuario?: string;
  email?: string;
  fotoURL?: string | null;
  creadoEn?: any | null;
  cerebros?: number;
  monedas?: number;
  vidas?: number;
  logros?: string[];
}
