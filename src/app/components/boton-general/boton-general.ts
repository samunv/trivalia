
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-boton-general',
  imports: [],
  templateUrl: './boton-general.html'
})
export class BotonGeneral {
  @Input() texto: string = '';
}
