import { Component } from '@angular/core';
import confetti, { shapeFromText } from "@fewell/canvas-confetti-ts";

@Component({
  selector: 'app-confeti-component',
  imports: [],
  templateUrl: './confeti-component.html',
})
export class ConfetiComponent {
  ngOnInit() {
    this.mostrarConfeti();
  }

  mostrarConfeti() {

    const emoji = shapeFromText({
      text:"🪙",
      scalar:1.5
    })

    
    confetti({
      shapes: [emoji],
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}
