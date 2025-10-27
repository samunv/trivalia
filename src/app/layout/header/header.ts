import { Component, computed, inject, Input, signal } from '@angular/core';
import { Item } from '../../components/item/item';
import { TextoH1 } from '../../components/texto-h1/texto-h1';
import { Usuario } from '../../interfaces/Usuario';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';

@Component({
  selector: 'app-header',
  imports: [Item, TextoH1
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private usuarioService = inject(UsuarioService);
  usuarioData = computed(() => this.usuarioService.usuario());

  constructor() { }

  @Input() titulo: string = "";

}
