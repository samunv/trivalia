import { Routes } from '@angular/router';
import { Landing } from '../pages/landing/landing';
import { Login } from '../pages/login/login';
import { Registro } from '../pages/registro/registro';
import { Aprender } from '../pages/aprender/aprender';
import { Perfil } from '../pages/perfil/perfil';
import { UnionPartida } from '../pages/union-partida/union-partida';

import { noAuthGuard } from './Guards/no-auth-guard';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

export const routes: Routes = [
  { path: '', component: Landing, canActivate: [noAuthGuard] },
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: 'registro', component: Registro, canActivate: [noAuthGuard] },
  { path: 'aprender', component: Aprender, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'perfil', component: Perfil, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'union-partida', component: UnionPartida, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  // Siempre debe ir al final
  { path: '**', redirectTo: '', pathMatch: 'full' },




];

