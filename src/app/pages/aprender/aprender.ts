import { Component } from '@angular/core';
import { NavLateral } from '../../layout/nav-lateral/nav-lateral';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { TextoH1 } from '../../components/texto-h1/texto-h1';
import { Item } from '../../components/item/item';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
import { Header } from '../../layout/header/header';
import { CategoriaService } from '../../services/CategoriaService/categoria-service';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../interfaces/Categoria';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-aprender',
  imports: [NavLateral, MainLayout, TextoH1, Item, Header, CommonModule, FormsModule, RouterLink],
  templateUrl: './aprender.html',
  styleUrl: './aprender.css'
})
export class Aprender {
  inputBuscadorActivo = false;
  usuario?: Usuario;
  categorias?: Categoria[] = [];
  valorBusqueda?: string | any;


  constructor(private usuarioService: UsuarioService, private categoriaService: CategoriaService, private router: Router) { }

  ngOnInit() {
    this.usuarioService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    })

    this.categoriaService.obtenerCategorias().subscribe((data) => {
      this.categorias = data;
    })
  }

  filtrarCategorias(valorBusqueda: string): Categoria[] | any {
    return this.categorias?.filter((c) => c.titulo?.toLowerCase().includes(valorBusqueda?.toLowerCase()))
  }

  navegarHaciaCategoria(idCategoria: number | any) {
    this.router.navigate(['/categoria', idCategoria])
  }

}
