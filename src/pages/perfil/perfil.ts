import { Component, inject } from '@angular/core';
import { NavLateral } from '../../app/layout/nav-lateral/nav-lateral';
import { MainLayout } from '../../app/layout/main-layout/main-layout';
import { AuthService } from '../../app/services/AuthService/auth-service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../app/services/UsuarioService/usuario-service';
import { CommonModule } from '@angular/common';
import { TextoH1 } from '../../app/components/texto-h1/texto-h1';
import { BotonGeneral } from '../../app/components/boton-general/boton-general';
import { Modal } from '../../app/components/modal/modal';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { addDoc, collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';

@Component({
  selector: 'app-perfil',
  imports: [NavLateral, MainLayout, CommonModule, TextoH1, BotonGeneral, Modal, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {


  constructor(private authService: AuthService, private router: Router, private usuarioService: UsuarioService, private firestore: Firestore, private auth: Auth) { }

  modalAbierto: boolean = false;
  usuario: any;
  nombre: any;
  foto?: string;
  uid?: any;

  ngOnInit() {
    this.usuarioService.usuario$.subscribe(user => {
      this.usuario = user;
      this.nombre = new FormControl(user.nombre, [Validators.minLength(4), Validators.maxLength(15)]);
    });
    console.log("Perfil >> Foto del usuario: " + this.usuario.fotoURL);
    authState(this.auth).subscribe(user => {
      if (user) {
        this.uid = user.uid;
        console.log('UID:', user.uid);
      } else {
        console.log('No hay usuario logueado');
      }
    });
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

  guardar(nombre: string, uid: string): Observable<any> {
    const usuarioDocRef = doc(this.firestore, 'usuarios', uid);
    return from(updateDoc(usuarioDocRef, {
      nombre: nombre,
      actualizado: new Date()
    }))
  }

  guardarClick() {
    if (!this.uid) {
      console.error('UID no definido, no se puede guardar');
      return;
    }

    this.guardar(this.nombre?.value ?? '', this.uid).subscribe({
      next: () => {
        alert('Usuario actualizado')
        this.usuarioService.setUsuario({
          //Esto signfica dejar todos los datos del objeto usuario tal cual están,
          // y sobreescribir el nombre
          ...this.usuario,
          nombre:this.nombre?.value
        })
        this.nombre.markAsPristine();

      },
      error: (err) => console.error('Error al actualizar', err)
    });
  }

}
