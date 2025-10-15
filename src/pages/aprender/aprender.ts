import { Component } from '@angular/core';
import { NavLateral } from '../../app/layout/nav-lateral/nav-lateral';
import { MainLayout } from '../../app/layout/main-layout/main-layout';
import { TextoH1 } from '../../app/components/texto-h1/texto-h1';

@Component({
  selector: 'app-aprender',
  imports: [NavLateral, MainLayout, TextoH1],
  templateUrl: './aprender.html',
  styleUrl: './aprender.css'
})
export class Aprender {

  inputBuscadorActivo = false;
}
