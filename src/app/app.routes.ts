import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Aprender } from './pages/aprender/aprender';
import { Perfil } from './pages/perfil/perfil';
import { PreJuego } from './pages/pre-juego/pre-juego';
import { PaginaPreguntas } from './pages/pagina-preguntas/pagina-preguntas';
import { noAuthGuard } from './Guards/no-auth-guard/no-auth-guard';
import { authGuard } from './Guards/auth-guard/auth-guard-guard';
import { FinPartida } from './pages/fin-partida/fin-partida';
import { Clasificacion } from './pages/clasificacion/clasificacion';

export const routes: Routes = [
  { path: '', component: Login, canActivate: [noAuthGuard] },
  // { path: 'registro', component: Registro, canActivate: [noAuthGuard] },
  { path: 'jugar', component: Aprender, canActivate: [authGuard] },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: 'categoria/:idCategoria', component: PreJuego, canActivate: [authGuard] },
  { path: 'partida', component: PaginaPreguntas, canActivate: [authGuard] },
  { path: 'clasificacion', component: Clasificacion, canActivate: [authGuard] },
  // Siempre debe ir al final
  { path: '**', redirectTo: '/jugar', pathMatch: 'full' },




];

