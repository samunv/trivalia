import { Component, computed, inject, signal } from '@angular/core';
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
  imports: [MainLayout, Header, CommonModule, FormsModule],
  templateUrl: './aprender.html',
  styleUrl: './aprender.css'
})
export class Aprender {

  private usuarioService = inject(UsuarioService);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);

  constructor() { }

  inputBuscadorActivo = false;
  usuario = computed(() => this.usuarioService.usuario());
  categorias = signal<Categoria[]>([]);
  valorBusqueda = signal<string>("");


  ngOnInit() {
    this.categoriaService.obtenerCategorias().subscribe((categorias: Categoria[]) => {
      this.categorias.set(categorias);
    })
  }

  filtrarCategorias(valorBusqueda: string): Categoria[] | any {
    return this.categorias()?.filter((categoria: Categoria) => categoria.titulo?.toLowerCase().includes(valorBusqueda?.toLowerCase()))
  }

  navegarHaciaCategoria(idCategoria: number | any) {
    this.router.navigate(['/categoria', idCategoria])
  }

}
