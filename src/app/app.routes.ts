import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Aprender } from './pages/aprender/aprender';
import { Perfil } from './pages/perfil/perfil';
import { UnionPartida } from './pages/union-partida/union-partida';

import { noAuthGuard } from './Guards/no-auth-guard';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/']);

export const routes: Routes = [
  { path: '', component: Login, canActivate:[noAuthGuard]},
  // { path: 'registro', component: Registro, canActivate: [noAuthGuard] },
  { path: 'jugar', component: Aprender, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'perfil', component: Perfil, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'union-partida', component: UnionPartida, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  // Siempre debe ir al final
  { path: '**', redirectTo: '/jugar', pathMatch: 'full' },




];

