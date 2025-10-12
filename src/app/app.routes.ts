import { Routes } from '@angular/router';
import { Landing } from '../pages/landing/landing';
import { Login } from '../pages/login/login';
import { Registro } from '../pages/registro/registro';
import { Aprender } from '../pages/aprender/aprender';
import { Perfil } from '../pages/perfil/perfil';
import { UnionPartida } from '../pages/union-partida/union-partida';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'aprender', component: Aprender },
  { path: 'perfil', component: Perfil },
  { path: 'union-partida', component:  UnionPartida},
  // Siempre debe ir al final
  { path: '**', redirectTo: '', pathMatch: 'full' },




];

