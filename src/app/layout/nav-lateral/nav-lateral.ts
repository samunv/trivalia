import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-nav-lateral',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './nav-lateral.html',
  styleUrl: './nav-lateral.css'
})
export class NavLateral {
  private usuarioService = inject(UsuarioService)
  private router = inject(Router);

  fotoUsuario = computed(()=>this.usuarioService.usuario()?.fotoURL);

  constructor() {
  }

  irHaciaAprender() {
    this.router.navigate(['/aprender']);
  }
}
