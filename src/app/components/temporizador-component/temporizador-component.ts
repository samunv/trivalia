import { CommonModule } from '@angular/common';
import { Component, effect, input, Input, output, signal } from '@angular/core';

@Component({
  selector: 'app-temporizador-component',
  templateUrl: './temporizador-component.html',
  styleUrl: './temporizador-component.css',
  imports: [CommonModule]
})
export class TemporizadorComponent {

  private intervalo: any;
  private tiempoInicial: number = 10;
  reiniciar = input<boolean>(false);
  terminar = output<boolean>({ alias: 'temporizadorTerminado' });
  tiempo = signal<number>(this.tiempoInicial);
  pausar = input<boolean>(false)

  constructor() {
    effect(() => {
      if (this.reiniciar()) {
        this.reiniciarTemporizador();
      }
      if(this.pausar()){
        this.limpiarIntervalo()
      }
    });
  }

  ngOnInit() {
    this.temporizadorAutomatico();
  }

  private reiniciarTemporizador() {
    this.limpiarIntervalo();
    this.tiempo.set(this.tiempoInicial);
    this.temporizadorAutomatico();
    this.reiniciar();
  }

  private temporizadorAutomatico() {
    this.limpiarIntervalo();

    this.intervalo = setInterval(() => {
      const tiempoActual = this.tiempo();
      if (tiempoActual > 0) {
        this.tiempo.set(tiempoActual - 1);
      } else {
        console.log('Hijo: ¡EMITIENDO EVENTO!');
        this.terminar.emit(true);
        this.limpiarIntervalo();
      }
    }, 1000);
  }

  private limpiarIntervalo(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  ngOnDestroy(): void {
    this.limpiarIntervalo();
  }
}
