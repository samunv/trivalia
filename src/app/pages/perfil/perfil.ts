import { Component, inject } from '@angular/core';
import { NavLateral } from '../../layout/nav-lateral/nav-lateral';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { AuthService } from '../../services/AuthService/auth-service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { CommonModule } from '@angular/common';
import { TextoH1 } from '../../components/texto-h1/texto-h1';
import { BotonGeneral } from '../../components/boton-general/boton-general';
import { Modal } from '../../components/modal/modal';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { addDoc, collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { MensajeAlerta } from '../../components/mensaje-alerta/mensaje-alerta';
import { ImagenesService } from '../../services/ImagenesService/imagenes-service';

@Component({
  selector: 'app-perfil',
  imports: [NavLateral, MainLayout, CommonModule, TextoH1, BotonGeneral, Modal, ReactiveFormsModule, MensajeAlerta],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {


  constructor(private authService: AuthService, private router: Router, private usuarioService: UsuarioService, private firestore: Firestore, private auth: Auth, private imagenService: ImagenesService) { }

  modalAbierto: boolean = false;
  usuario: any;
  nombre: any;
  foto?: string;
  uid?: any;
  guardado: boolean = false;
  imagenSeleccionada: File | null = null;
  editarFotoActivo: boolean = false;

  ngOnInit() {
    this.usuarioService.usuario$.subscribe(user => {
      this.usuario = user;
      this.nombre = new FormControl(user.nombre, [Validators.required, Validators.minLength(4), Validators.maxLength(15)]);
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

  activarEditarFoto(){
    this.editarFotoActivo = true;
  }

  onImagenSeleccionada(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      console.log('Archivo seleccionado:', file.name);
    }
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

  guardar(uid: string, nombre: string, foto: string): Observable<any> {
    const usuarioDocRef = doc(this.firestore, 'usuarios', uid);
    return from(updateDoc(usuarioDocRef, {
      nombre: nombre.trim(),
      fotoURL: foto,
      actualizado: new Date()
    }))

  }


  guardarClick() {
    if (!this.uid || this.nombre.invalid) {
      alert('Error');
      return;
    }

    // Si hay una imagen nueva, primero la subimos
    if (this.imagenSeleccionada != null) {
      this.enviarImagen(this.imagenSeleccionada).subscribe({
        next: (data) => {
          const nuevaURL = data.data.url; // URL de la nueva imagen
          this.guardar(this.uid, this.nombre?.value ?? '', nuevaURL).subscribe({
            next: () => this.finalizarGuardado(nuevaURL),
            error: (err) => console.error('Error al guardar con nueva imagen:', err)
          });
        },
        error: (err) => console.error('Error al subir la imagen:', err)
      });
    } else {
      // Si no hay imagen nueva
      this.guardar(this.uid, this.nombre?.value ?? '', this.usuario.fotoURL).subscribe({
        next: () => this.finalizarGuardado(this.usuario.fotoURL),
        error: (err) => console.error('Error al guardar sin imagen nueva:', err)
      });
    }
  }

  finalizarGuardado(fotoURL: string) {
    this.guardado = true;
    setTimeout(() => (this.guardado = false), 3000);

    this.usuarioService.setUsuario({
      ...this.usuario,
      nombre: this.nombre?.value,
      fotoURL: fotoURL
    });

    this.nombre.markAsPristine();
  }


  enviarImagen(imagen: File): Observable<any> {
    const formData = new FormData();
    formData.append("image", imagen)
    return this.imagenService.enviarImagen(formData)
  }

}

