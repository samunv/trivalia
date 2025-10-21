import { Component } from '@angular/core';
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
  urlActual?: string;
  constructor(public router: Router, private usuarioService: UsuarioService) { }

  fotoUsuario: string = ""

  ngOnInit() {
    this.usuarioService.usuario$.subscribe(user => {
      this.fotoUsuario = user?.fotoURL;
    })
  }

  irHaciaAprender() {
    this.router.navigate(['/aprender']);
  }
}
