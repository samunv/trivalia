import { Component, inject, Signal, WritableSignal } from '@angular/core';
import { ConfetiComponent } from '../../components/confeti-component/confeti-component';
import { Modal } from '../../components/modal/modal';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
import { Router } from '@angular/router';
import { CategoriaService } from '../../services/CategoriaService/categoria-service';
import { Categoria } from '../../interfaces/Categoria';
import { Item } from '../../components/item/item';
import { UsuarioGlobalStoreService } from '../../services/Global/UsuarioGlobalStoreService/usuario-global-store-service';

@Component({
  selector: 'app-fin-partida',
  imports: [ConfetiComponent, Modal, Item
  ],
  templateUrl: './fin-partida.html',
  styleUrl: './fin-partida.css'
})
export class FinPartida {
  private router: Router = inject(Router);
  private categoriaService: CategoriaService = inject(CategoriaService);
  private usuarioStoreService: UsuarioGlobalStoreService = inject(UsuarioGlobalStoreService);
  usuario: Signal<Usuario> = this.usuarioStoreService.usuario;
  nombreUsuario?: string = this.usuario()?.nombre;

  categoria: Signal<Categoria> = this.categoriaService.categoria

  monedasRecompensa: number = 100;

  constructor() { }

  cerrar() {
    this.router.navigate(["/jugar"])
  }

}
