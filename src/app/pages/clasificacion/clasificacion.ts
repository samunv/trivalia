import { Component, computed, effect, inject, signal, Signal, WritableSignal } from '@angular/core';
import { Header } from '../../layout/header/header';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { TextoH1 } from '../../components/texto-h1/texto-h1';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
import { Subscribable } from 'rxjs';
import { Item } from '../../components/item/item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clasificacion',
  imports: [Header, MainLayout, TextoH1, Item, CommonModule],
  templateUrl: './clasificacion.html',
  styleUrl: './clasificacion.css'
})
export class Clasificacion {

  private usuarioService: UsuarioService = inject(UsuarioService);

  constructor() {
    effect(() => {
      if (this.filtroSeleccionado()) {
        this.crearArrayUsuariosOrdenadosConFiltroSeleccionado(this.filtroSeleccionado());
      }
    })
  }

  usuarios: WritableSignal<Usuario[]> = signal<Usuario[]>([]);
  usuariosOrdenados: WritableSignal<Usuario[]> = signal<Usuario[]>([]);
  filtroSeleccionado: WritableSignal<string> = signal<string>("estrellas");
  
  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuarioService.obtenerUsuarios(20).subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuarios.set(usuarios);
        this.crearArrayUsuariosOrdenadosConFiltroSeleccionado(this.filtroSeleccionado());

      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  crearArrayUsuariosOrdenadosConFiltroSeleccionado(filtroSeleccionado: string) {
    if (filtroSeleccionado === "estrellas") {
      this.ordenarUsuariosPorEstrellas(this.usuarios());
    } else if (filtroSeleccionado === "partidasGanadas") {
      this.ordenarUsuariosPorPartidasGanadas(this.usuarios());
    }
  }

  ordenarUsuariosPorEstrellas(usuarios: Usuario[]) {
    this.usuariosOrdenados.set(usuarios.sort((a, b) => Number(b.estrellas) - Number(a.estrellas)))
  }

  ordenarUsuariosPorPartidasGanadas(usuarios: Usuario[]) {
    this.usuariosOrdenados.set(usuarios.sort((a, b) => Number(b.partidasGanadas) - Number(a.partidasGanadas)))
  }


  seleccionarFiltro(filtro: string) {
    this.filtroSeleccionado.set(filtro);
  }

}
