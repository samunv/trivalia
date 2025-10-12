import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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


  constructor(private router: Router) { }

  irHaciaLanding() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if(!this.loginForm.valid){
      alert("Por favor, verifica que los datos ingresados sean correctos");
      console.log(this.loginForm);
      return;
    }
    console.log(this.loginForm);
  }

}
