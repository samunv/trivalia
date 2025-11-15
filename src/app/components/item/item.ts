import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'item',
  imports: [CommonModule],
  templateUrl: './item.html'
})
export class Item {
  @Input() item?: "estrellas" | "monedas" | "vidas" | "regalo";
  @Input() cantidad?: number = 0;
  @Input() cssFlexRow?: "row" | "reverse" = "row"
  @Input() cssIconDimension?: number = 30
}
