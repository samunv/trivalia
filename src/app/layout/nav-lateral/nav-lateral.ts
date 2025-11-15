import { Component, computed, effect, inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { filter } from 'rxjs';
import { Regalo } from '../../components/regalo/regalo';
import { Usuario } from '../../interfaces/Usuario';

@Component({
  selector: 'app-nav-lateral',
  imports: [CommonModule, RouterLink, RouterModule, Regalo],
  templateUrl: './nav-lateral.html',
  styleUrl: './nav-lateral.css'
})
export class NavLateral {
  private usuarioService = inject(UsuarioService)
  private router = inject(Router);

  usuario: Signal<Usuario> = this.usuarioService.usuario
  fotoUsuario = this.usuario()?.fotoURL;
  ventanaRegaloAbierta: boolean = false;


  constructor() {
  }

  irHaciaAprender() {
    this.router.navigate(['/aprender']);
  }

  abrirVentanaRegalo() {
    if (this.usuario()?.regaloDisponible) {
      this.ventanaRegaloAbierta = true
    }
  }

  cerrarVentanaRegalo() {
    this.ventanaRegaloAbierta = false
  }

}
