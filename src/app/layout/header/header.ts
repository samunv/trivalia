import { Component, Input } from '@angular/core';
import { Item } from '../../components/item/item';
import { TextoH1 } from '../../components/texto-h1/texto-h1';
import { Usuario } from '../../interfaces/Usuario';

@Component({
  selector: 'app-header',
  imports: [Item, TextoH1
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Input() usuarioData?: Usuario;
  @Input() titulo: string = "";

}
