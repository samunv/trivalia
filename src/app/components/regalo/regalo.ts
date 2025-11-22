import { Component, EventEmitter, inject, Output, Signal, signal } from '@angular/core';
import { Modal } from '../modal/modal';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { RegaloInterface } from '../../interfaces/RegaloInterface';
import { Item } from '../item/item';
import { RegaloService } from '../../services/RegaloService/regalo-service';
import { Usuario } from '../../interfaces/Usuario';

@Component({
  selector: 'app-regalo',
  imports: [Modal, Item],
  templateUrl: './regalo.html',
  styleUrl: './regalo.css'
})
export class Regalo {
  private usuarioService = inject(UsuarioService);
  private regaloService = inject(RegaloService)

  @Output() cancelar = new EventEmitter<void>();

  constructor() { }

  usuario: Signal<Usuario> = this.usuarioService.usuario;
  itemObtenido = signal<"estrellas" | "monedas" | "vidas" | undefined>(undefined);
  cantidadItemObtenido = signal<number>(0);
  vectorRegaloVisible = signal<boolean>(true);

  onCancelar() {
    this.cancelar.emit();
  }

  abrirRegalo(): void {
    this.vectorRegaloVisible.set(false);
    this.regaloService.abrirRegalo(String(this.usuario().uid))
      .subscribe(
        (regaloObtenido: RegaloInterface) => {
          this.mostrarRecompensaInterfaz(regaloObtenido);
          this.actualizarUsuario(regaloObtenido);
        })
  }


  mostrarRecompensaInterfaz(regaloObtenido: RegaloInterface) {
    this.itemObtenido.set(regaloObtenido.item)
    this.cantidadItemObtenido.set(Number(regaloObtenido.cantidad))
  }

  actualizarUsuario(regaloObtenido: RegaloInterface) {
    const itemClave = regaloObtenido.item as "estrellas" | "monedas" | "vidas";

    const valorActual: number | undefined = this.usuario()[itemClave];
    const nuevoValor = Number(valorActual || 0) + Number(regaloObtenido.cantidad);

    this.usuarioService.updateUsuarioSignal(itemClave, nuevoValor);
    this.usuarioService.updateUsuarioSignal("regaloDisponible", false);
  }

}


