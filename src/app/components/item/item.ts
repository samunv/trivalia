import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'item',
  imports: [CommonModule],
  templateUrl: './item.html',
  styleUrls:['./item.css']
})
export class Item {
  @Input() item?: "estrellas" | "monedas" | "vidas" | "regalo";
  @Input() cantidad: number = 0;
  @Input() cssFlexRow?: "row" | "reverse" = "row";
  @Input() cssIconDimension: number = 30;
  @Input() cssAnimation?: "saltar" | "" = "";

  obtenerCantidadFormateada(cantidad: number): string {
    return cantidad > 10000 ? Math.floor(cantidad / 1000) + 'k' : cantidad.toString();
  }
}



