import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'item',
  imports: [CommonModule],
  templateUrl: './item.html'
})
export class Item {
  @Input() item?: "cerebro" | "moneda" | "vida";
  @Input() cantidad?: number = 0;
}
