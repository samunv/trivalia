import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavLateral } from '../nav-lateral/nav-lateral';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, NavLateral],
templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
