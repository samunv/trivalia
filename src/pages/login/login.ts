import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../app/services/AuthService/auth-service';
import { UsuarioService } from '../../app/services/UsuarioService/usuario-service';
import { Usuario } from '../../app/interfaces/Usuario';
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

  login() {
    this.authService.login(this.loginForm.value.correo as string, this.loginForm.value.contrasena as string).subscribe({
      next: (res) => {
        console.log('Login exitoso:' + res.usuario + ", token: " + res.token);
        this.router.navigate(['/aprender']);
        this.usuarioService.setUsuario(res.usuario);
        this.usuarioService.setToken(res.token);
      }
      ,
      error: (err) => {
        console.error('Error durante el login:', err);
        alert('Error durante el login. Por favor, verifica tus credenciales e intenta de nuevo.');
      }
    })
  }

  loginConApple() {
    this.authService.loginConApple().subscribe({
      next: (res) => {
        console.log('Login con Apple exitoso:', res.usuario);
        this.iniciarSesion(res.usuario, res.token);
      },
      error: (err) => {
        console.error('Error durante el login con Apple:', err);
        alert('Error durante el login con Apple. Por favor, intenta de nuevo.');
      }
    })
  }

  loginConGoogle() {
    this.authService.loginConGoogle().subscribe({
      next: (res) => {
        console.log('Login con Google exitoso:', res.usuario);
        this.iniciarSesion(res.usuario, res.token);
      },
      error: (err) => {
        console.error('Error durante el login con Google:', err);
        alert('Error durante el login con Google. Por favor, intenta de nuevo.');
      }
    });
  }

  iniciarSesion(usuario: Usuario, token: string) {
    this.router.navigate(['/aprender']);
    this.usuarioService.setUsuario(usuario);
    this.usuarioService.setToken(token);
  }


}
