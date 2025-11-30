import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, Input, output, signal } from '@angular/core';
import { BotonGeneral } from '../boton-general/boton-general';
import { Item } from '../item/item';
import { Espacio } from '../espacio/espacio';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';

@Component({
  selector: 'app-temporizador-component',
  templateUrl: './temporizador-component.html',
  styleUrl: './temporizador-component.css',
  imports: [
    CommonModule,
    BotonGeneral,
    Item,
    Espacio
  ]
})
export class TemporizadorComponent {

  private usuarioService = inject(UsuarioService);
  private intervalo: any;
  private tiempoInicial: number = 20;
  reiniciar = input<boolean>(false);
  terminar = output<boolean>({ alias: 'temporizadorTerminado' });
  tiempo = signal<number>(this.tiempoInicial);
  pausar = input<boolean>(false)
  usuario = this.usuarioService.usuario;

  constructor() {
    effect(() => {
      if (this.reiniciar()) {
        this.reiniciarTemporizador();
      }
      if (this.pausar()) {
        this.limpiarIntervalo()
      }
    });
  }

  ngOnInit() {
    this.temporizadorAutomatico();
  }

  private reiniciarTemporizador() {
    this.limpiarIntervalo();
    this.tiempo.set(19);
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
    this.tiempo.set(0)
  }
}
