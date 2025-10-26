import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { Usuario } from '../../interfaces/Usuario';
@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  fb = inject(FormBuilder);

  loginForm = this.fb.group(
    {
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    }
  );


  constructor(private router: Router, private authService: AuthService, private usuarioService: UsuarioService) { }

  irHaciaLanding() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      alert("Por favor, verifica que los datos ingresados sean correctos");
      console.log(this.loginForm);
      return;
    }
    console.log(this.loginForm);
  }

  loginConGoogle() {
    this.authService.loginConGoogle().subscribe({
      next: (res) => {
        console.log('✅ Login con Google exitoso:', res.usuario);
        console.log('🔹 Token de Firebase:', res.token);

        this.authService.autenticar(res.token).subscribe({
          next: (authRes) => {
            if ('token' in authRes) {

              // Guardamos el usuario y el JWT
              this.usuarioService.setUsuario(res.usuario);
              this.usuarioService.setToken(authRes.token);

              // Redirigimos después de guardar todo
              this.router.navigate(['/dummy'], { skipLocationChange: true }).then(() => {
                this.router.navigate(['/jugar']);
              });
            } else if ('error' in authRes) {
              console.error("❌ Error al autenticar:", authRes.error);
              alert("Error al autenticar con el servidor.");
            }
          },
          error: (err) => {
            console.error("❌ Error HTTP al autenticar:", err);
            alert("No se pudo autenticar con el backend.");
          }
        });
      },
      error: (err) => {
        console.error(' Error durante el login con Google:', err);
        alert('Error durante el login con Google. Por favor, intenta de nuevo.');
      }
    });
  }


  autenticarToken(fbToken: string) {
    this.authService.autenticar(fbToken).subscribe(res => {
      if ('token' in res) {
        this.usuarioService.setToken(res.token);
      } else if ('error' in res) {
        console.error("Error al autenticar:", res.error);
      }
    });
  }

  iniciarSesion(usuario: Usuario) {
    this.router.navigate(['/dummy'], { skipLocationChange: true }).then(() => {
      this.router.navigate(['/jugar']);
    });
    this.usuarioService.setUsuario(usuario);
  }


}
