import { Component, computed, inject, Input, Signal, signal } from '@angular/core';
import { Item } from '../../components/item/item';
import { TextoH1 } from '../../components/texto-h1/texto-h1';
import { Usuario } from '../../interfaces/Usuario';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { UsuarioGlobalStoreService } from '../../services/Global/UsuarioGlobalStoreService/usuario-global-store-service';

@Component({
  selector: 'app-header',
  imports: [Item, TextoH1
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private usuarioStoreService: UsuarioGlobalStoreService = inject(UsuarioGlobalStoreService);
  usuarioData: Signal<Usuario> = this.usuarioStoreService.usuario;

  constructor() { }

  @Input() titulo: string = "";

}
