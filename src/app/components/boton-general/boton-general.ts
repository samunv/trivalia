
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-boton-general',
  imports: [CommonModule],
  templateUrl: './boton-general.html'
})
export class BotonGeneral {
  @Input() texto: string = '';
  @Input() tipo: 'general' | 'destacado' | 'rojo' = 'general'
}
