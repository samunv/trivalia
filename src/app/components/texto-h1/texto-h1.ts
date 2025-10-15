import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-texto-h1',
  imports: [],
  templateUrl: './texto-h1.html',
})
export class TextoH1 {
  @Input() texto: string = "";
}
