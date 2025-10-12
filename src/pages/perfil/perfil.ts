import { Component } from '@angular/core';
import { NavLateral } from '../../app/layout/nav-lateral/nav-lateral';
import { MainLayout } from '../../app/layout/main-layout/main-layout';

@Component({
  selector: 'app-perfil',
  imports: [NavLateral, MainLayout],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {

}
