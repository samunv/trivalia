import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, AbstractControlOptions, EmailValidator, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  fb = inject(FormBuilder);

  registroForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/)]],
    confirmarContrasena: ['', [Validators.required]]
  }, {
    validators: [this.comprobarContrasena]
  });

  comprobarContrasena(formGroup: AbstractControl) {
    const controlContrasena = formGroup.get('contrasena');
    const controlConfirmarContrasena = formGroup.get('confirmarContrasena');
    return controlContrasena?.value === controlConfirmarContrasena?.value ? null : { noSonIguales: true };
  }


  constructor(private router: Router) { }
  irHaciaLanding() {
    this.router.navigate(['/']);
  }


  onSubmit() {
    if (this.registroForm.invalid
    ) {

      alert("Por favor, verifica que los datos ingresados sean correctos");
      console.log(this.registroForm);
      return;
    }

    console.log(this.registroForm);



  }
}
