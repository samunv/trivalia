import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
import { RespuestaServidor } from '../../interfaces/RespuestaServidor';
import { map, Observable } from 'rxjs';
@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private usuarioService = inject(UsuarioService)

  constructor(private router: Router, private authService: AuthService) { }
  usuarioSignal = this.usuarioService.usuario
  tokenSignal = this.usuarioService.token

  irHaciaLanding() {
    this.router.navigate(['/']);
  }

  loginConGoogle() {
    this.authService.loginConGoogle().subscribe({
      next: (res) => {
        this.obtenerJWT(res.firebaseToken).subscribe((jwt: string) => {
          this.establecerUsuarioYjwt(res.usuario, jwt);
          this.router.navigate(["/jugar"])
        })
      },
      error: (err) => {
        console.error(' Error durante el login con Google:', err);
        alert('Error durante el login con Google. Por favor, intenta de nuevo.');
      }
    });
  }

  obtenerJWT(firebaseToken: string): Observable<string> {
    return this.authService.autenticarFirebaseToken(firebaseToken).pipe(
      map((respuestaServidor: RespuestaServidor) => {
        if (respuestaServidor.token) {
          return respuestaServidor.token;
        } else {
          console.error("Error al autenticar: ", respuestaServidor.error);
          alert("Error al autenticar con el servidor.");
          throw new Error("Token Firebase inválido")
        }
      }))
  }

  establecerUsuarioYjwt(usuario: Usuario, token: string): void {
    this.usuarioService.setUsuario(usuario);
    this.usuarioService.setToken(token)
  }

  // iniciarSesion(usuario: Usuario) {
  //   this.router.navigate(['/dummy'], { skipLocationChange: true }).then(() => {
  //     this.router.navigate(['/jugar']);
  //   });
  //   this.usuarioSignal.set(usuario);
  // }


}
