import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { map, Observable } from 'rxjs';
import { UsuarioGlobalStoreService } from '../../services/Global/UsuarioGlobalStoreService/usuario-global-store-service';
@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private usuarioService = inject(UsuarioService)
  private usuarioStoreService: UsuarioGlobalStoreService = inject(UsuarioGlobalStoreService);
  usuario: Signal<Usuario> = this.usuarioStoreService.usuario;

  constructor(private router: Router, private authService: AuthService) { }



  ngOnInit() {
    if (this.usuario()) {
      this.usuarioService.clearUsuario();
    }
  }

  loginConGoogle() {
    this.authService.login().subscribe({
      next: (res) => {
        this.autenticar(res.firebaseToken).subscribe((resultado: boolean) => {
          if (resultado === true) {
            this.establecerUsuario(res.usuario)
            this.router.navigate(["/jugar"])
          }
        })
      },
      error: (err) => {
        console.error('Error durante el login con Google:', err);
        alert('Error durante el login con Google. Por favor, intenta de nuevo.');
      }
    });
  }

  autenticar(firebaseToken: string): Observable<boolean> {
    return this.authService.autenticarFirebaseToken(firebaseToken).pipe(
      map((respuestaServidor: RespuestaServidor) => {
        if (respuestaServidor.resultado) {
          return respuestaServidor.resultado as boolean;
        } else {
          console.error("Error al autenticar");
          alert("Error al autenticar con el servidor.");
          throw new Error("Token Firebase inválido")
        }
      }))
  }

  establecerUsuario(usuario: Usuario): void {
    this.usuarioStoreService.setUsuarioSignal(usuario);
  }



}
