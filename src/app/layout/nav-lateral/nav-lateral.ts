import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';

@Component({
  selector: 'app-nav-lateral',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './nav-lateral.html',
  styleUrl: './nav-lateral.css'
})
export class NavLateral {
  constructor(public router: Router, private usuarioService: UsuarioService) { }

  fotoUsuario: string = ""

  ngOnInit(){
    this.usuarioService.usuario$.subscribe(user => {
      this.fotoUsuario = user?.fotoURL;
    })
  }

  irHaciaAprender() {
    this.router.navigate(['/aprender']);
  }
}
