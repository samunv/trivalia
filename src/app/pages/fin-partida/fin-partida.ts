import { Component, inject, Signal, WritableSignal } from '@angular/core';
import { ConfetiComponent } from '../../components/confeti-component/confeti-component';
import { Modal } from '../../components/modal/modal';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
import { Router } from '@angular/router';
import { CategoriaService } from '../../services/CategoriaService/categoria-service';
import { Categoria } from '../../interfaces/Categoria';
import { Item } from '../../components/item/item';

@Component({
  selector: 'app-fin-partida',
  imports: [ConfetiComponent, Modal, Item
  ],
  templateUrl: './fin-partida.html',
  styleUrl: './fin-partida.css'
})
export class FinPartida {
  private usuarioService: UsuarioService = inject(UsuarioService);
  private router: Router = inject(Router);
  private categoriaService: CategoriaService = inject(CategoriaService);

  usuario: Signal<Usuario> = this.usuarioService.usuario;
  nombreUsuario?: string = this.usuario()?.nombre;

  categoria: Signal<Categoria> = this.categoriaService.categoria

  monedasRecompensa: number = 100;

  constructor() { }

  ngOnInit(){
    this.actualizarMonedasUsuario(this.monedasRecompensa)
    this.actualizarPartidasGanadasUsuario()
    this.actualizarRegaloDisponibleUsuario(true)
  }

  cerrar() {
    this.router.navigate(["/jugar"])
  }

  actualizarMonedasUsuario(monedasNuevas: number) {
    let monedasTotales: number = Number(this.usuario().monedas) + monedasNuevas;
    this.usuarioService.actualizarItemUsuarioConClaveValor("monedas", monedasTotales)
      .subscribe({
        next: () => {
          //this.usuarioService.updateUsuario("monedas", monedasTotales)
        },
        error: (error) => {
          console.log(error)
        }
      })
  }

  actualizarPartidasGanadasUsuario(){
    this.usuarioService.actualizarPartidasGanadas()
    //this.usuarioService.updateUsuario("partidasGanadas", Number(this.usuario()?.partidasGanadas) + 1)
  }

  actualizarRegaloDisponibleUsuario(valor: boolean){
    this.usuarioService.actualizarRegaloDisponible(valor);
  }


}
