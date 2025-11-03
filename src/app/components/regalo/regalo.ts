import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Modal } from '../modal/modal';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { RegaloInterface } from '../../interfaces/RegaloInterface';
import { Item } from '../item/item';

@Component({
  selector: 'app-regalo',
  imports: [Modal, Item],
  templateUrl: './regalo.html',
  styleUrl: './regalo.css'
})
export class Regalo {
  private usuarioService = inject(UsuarioService);

  @Output() cancelar = new EventEmitter<void>();

  constructor() { }

  usuario = this.usuarioService.usuario;
  itemObtenido = signal<"estrellas" | "monedas" | "vidas" | undefined>(undefined);
  cantidadItemObtenido = signal<number>(0);
  vectorRegaloVisible = signal<boolean>(true);

  onCancelar() {
    this.cancelar.emit();
  }

  abrirRegalo(): void{
    console.log("Abrir regalo llamado");
    console.log("Usuario:", this.usuario());
    console.log("Vector visible:", this.vectorRegaloVisible());

    if (this.comprobarFechaUltimoRegaloDelUsuario()) {
      this.vectorRegaloVisible.set(false);
      const regalo = this.obtenerRegalo();
      console.log("Regalo generado:", regalo);
      this.asignarRecompensaInterfaz(regalo);
      console.log("ItemObtenido >>>  " + this.itemObtenido())
      console.log("cantidadItems >>>  " + this.cantidadItemObtenido())
      this.actualizarItemsUsuario(regalo);
      this.actualizarFechaUltimoRegaloUsuario(new Date())
    } else {
      alert("No ha pasado 1 hora desde el último regalo");
    }
  }


  asignarRecompensaInterfaz(regaloObtenido: RegaloInterface) {
    this.itemObtenido.set(regaloObtenido.itemRecompensa)
    this.cantidadItemObtenido.set(Number(regaloObtenido.cantidadItem))
  }

  comprobarFechaUltimoRegaloDelUsuario(): boolean {
    const ultimaVez = this.obtenerUltimaFecha()
    const ahora = new Date();

    if (this.obtenerDiferenciaDeHoras(ahora, ultimaVez) >= 1) {
      return true
    } else {
      return false
    }
  }

  obtenerUltimaFecha(): Date {
    return new Date(this.usuario().fechaUltimoRegalo)
  }

  obtenerDiferenciaDeHoras(ahora: Date, ultimaVez: Date): number {
    const diferenciaMs = ahora.getTime() - ultimaVez.getTime();
    const horasPasadas = diferenciaMs / (1000 * 60 * 60);
    return horasPasadas;
  }

  obtenerRegalo(): RegaloInterface {
    const itemObtenido = this.obtenerItemAleatorio()
    let cantidadItems = 0;
    let regalo: RegaloInterface = {};

    if (itemObtenido == "vidas") {
      cantidadItems = this.obtenerCantidadItem(1, 2);
    } else if (itemObtenido == "estrellas") {
      cantidadItems = this.obtenerCantidadItem(10, 30);
    } else if (itemObtenido == "monedas") {
      cantidadItems = this.obtenerCantidadItem(100, 300)
    }

    regalo = {
      itemRecompensa: itemObtenido,
      cantidadItem: cantidadItems
    }
    return regalo;
  }

  obtenerItemAleatorio(): "estrellas" | "vidas" | "monedas" {
    const opciones: ("estrellas" | "vidas" | "monedas")[] = ["estrellas", "vidas", "monedas"];
    const indice = Math.floor(Math.random() * opciones.length);
    return opciones[indice];
  }

  obtenerCantidadItem(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  actualizarItemsUsuario(regalo: RegaloInterface) {
    let claveItem: string = regalo.itemRecompensa == "estrellas" ? "estrellas" : regalo.itemRecompensa == "monedas" ? "monedas" : "vidas"
    let cantidadItem: number = Number(regalo.cantidadItem)
    let cantidadTotalItem: number = Number(this.usuario()[claveItem]) + Number(cantidadItem);

    this.usuarioService.actualizarItemUsuarioConClaveValor(claveItem, cantidadTotalItem).subscribe({
      next: () => {
        this.usuarioService.updateUsuario(claveItem, cantidadTotalItem)
      },
      error: (error) => {
        console.log("Error: " + error)
      }
    })

  }

  actualizarFechaUltimoRegaloUsuario(ahora: Date){
    this.usuarioService.actualizarFechaUltimoRegaloUsuario(ahora).subscribe(
      {
        next:()=>{
          this.usuarioService.updateUsuario("fechaUltimoRegalo", ahora)
        },
        error:(error)=>{
          console.log(error)
          alert(error)
        }
      }
    )
  }


}
