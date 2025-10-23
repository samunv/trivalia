import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'espacio',
  imports: [CommonModule],
  templateUrl: './espacio.html'
})
export class Espacio {
  // También se puede utilizar con los Inputs vacíos en componentes que tengan Flex + Gap,
  // donde hará un efecto espacio automático
  
  @Input() altura?: number;
  @Input() ancho?: number;
}
