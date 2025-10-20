import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'espacio',
  imports: [CommonModule],
  templateUrl: './espacio.html'
})
export class Espacio {
  @Input() altura?: number;
  @Input() ancho?: number;
}
