import { Component } from '@angular/core';
import { NavLateral } from '../../app/layout/nav-lateral/nav-lateral';
import { MainLayout } from '../../app/layout/main-layout/main-layout';
import { AuthService } from '../../app/services/AuthService/auth-service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../app/services/UsuarioService/usuario-service';
import { CommonModule } from '@angular/common';
import { TextoH1 } from '../../app/components/texto-h1/texto-h1';
import { BotonGeneral } from '../../app/components/boton-general/boton-general';
import { Modal } from '../../app/components/modal/modal';

@Component({
  selector: 'app-perfil',
  imports: [NavLateral, MainLayout, CommonModule, TextoH1, BotonGeneral, Modal],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {

  constructor(private authService: AuthService, private router: Router, private usuarioService: UsuarioService) { }

  modalAbierto: boolean = false;
  usuario: any;

  ngOnInit() {
    this.usuarioService.usuario$.subscribe(user => {
      this.usuario = user;
    });
    console.log("Perfil >> Foto del usuario: " + this.usuario.fotoURL);
  }

  cerrarSesion() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Sesión cerrada exitosamente');
        this.router.navigate(['/login']);
        this.usuarioService.clearUsuario();

      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
      }
    });
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }
}
