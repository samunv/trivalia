import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mensaje-alerta',
  imports: [CommonModule],
  templateUrl: './mensaje-alerta.html',
  animations: [

  ],
})
export class MensajeAlerta {
  @Input() mensaje: string = "";
  @Input() tipo: 'exito' | 'error' | 'info' = 'exito';
}
