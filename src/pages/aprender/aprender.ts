import { Component } from '@angular/core';
import { NavLateral } from '../../app/layout/nav-lateral/nav-lateral';
import { MainLayout } from '../../app/layout/main-layout/main-layout';

@Component({
  selector: 'app-aprender',
  imports: [NavLateral, MainLayout],
  templateUrl: './aprender.html',
  styleUrl: './aprender.css'
})
export class Aprender {

  inputBuscadorActivo = false;
}
