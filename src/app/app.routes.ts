import { Routes } from '@angular/router';
import { Landing } from '../pages/landing/landing';
import { Login } from '../pages/login/login';
import { Registro } from '../pages/registro/registro';
import { Aprender } from '../pages/aprender/aprender';
import { Perfil } from '../pages/perfil/perfil';
import { UnionPartida } from '../pages/union-partida/union-partida';
import { AuthGuard } from '@angular/fire/auth-guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'aprender', component: Aprender, canActivate: [AuthGuard] },
  { path: 'perfil', component: Perfil, canActivate: [AuthGuard]},
  { path: 'union-partida', component:  UnionPartida, canActivate: [AuthGuard]},
  // Siempre debe ir al final
  { path: '**', redirectTo: '', pathMatch: 'full' },




];

