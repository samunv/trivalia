import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonGeneral } from '../boton-general/boton-general';
import { Espacio } from '../espacio/espacio';

@Component({
  selector: 'app-modal',
  imports: [BotonGeneral, Espacio],
  templateUrl: './modal.html',
})
export class Modal {
  @Input() titulo: string = "";
  @Input() btn1: string = "";
  @Input() btn2: string = "";
  @Input() btn2Activo: boolean = true;
  @Output() click1 = new EventEmitter<void>();
  @Output() click2 = new EventEmitter<void>();

  onClick1() {
    this.click1.emit();
  }

  onClick2() {
    this.click2.emit();
  }
}

