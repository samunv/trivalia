export interface Usuario {
  uid: string;
  codigo_usuario: string;
  nombre: string;
  correo: string;
  fotoURL?: string | null;
  creadoEn: Date | null;
  cerebros?: number;
  monedas?: number;
  vidas?: number;
}
