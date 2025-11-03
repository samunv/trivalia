import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { NavLateral } from '../../layout/nav-lateral/nav-lateral';
import { MainLayout } from '../../layout/main-layout/main-layout';
import { AuthService } from '../../services/AuthService/auth-service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/UsuarioService/usuario-service';
import { CommonModule } from '@angular/common';
import { TextoH1 } from '../../components/texto-h1/texto-h1';
import { BotonGeneral } from '../../components/boton-general/boton-general';
import { Modal } from '../../components/modal/modal';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { MensajeAlerta } from '../../components/mensaje-alerta/mensaje-alerta';
import { ImagenesService } from '../../services/ImagenesService/imagenes-service';
import { Espacio } from '../../components/espacio/espacio';
import { Item } from '../../components/item/item';
import { Header } from '../../layout/header/header';
import { Usuario } from '../../interfaces/Usuario';
import { PreguntaService } from '../../services/PreguntaService/pregunta-service';
import { Pregunta } from '../../interfaces/Pregunta';
import { NgxNumberTickerComponent } from '@omnedia/ngx-number-ticker';

@Component({
  selector: 'app-perfil',
  imports: [MainLayout, CommonModule, TextoH1,
    BotonGeneral, Modal, ReactiveFormsModule, MensajeAlerta, Espacio, Header, NgxNumberTickerComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private imagenService = inject(ImagenesService);
  private preguntaService = inject(PreguntaService);

  modalAbierto = signal<boolean>(false);
  nombreFormControl: WritableSignal<FormControl> = signal<FormControl | any>(null);
  foto = signal<string>("");
  uid = signal<string>("");
  guardado = signal<boolean>(false)
  imagenSeleccionada = signal<File | null>(null)
  editarFotoActivo = signal<boolean>(false)
  fotoPreview = signal<any>(null)
  usuario = this.usuarioService.usuario;
  preguntasDificilesGanadas = signal<number>(0);
  display = signal<number>(0)

  constructor() {
  }

  ngOnInit() {
    const usuario = this.usuario();
    if (usuario) {
      this.nombreFormControl.set(new FormControl(usuario.nombre, [Validators.required, Validators.minLength(4), Validators.maxLength(15)]));
      this.foto.set(this.usuario().fotoURL)
    }

    this.obtenerPreguntasDificilesGanadas(this.usuario().arrayIdPreguntasGanadas);
  }

  activarEditarFoto() {
    this.editarFotoActivo.set(true);
  }

  onImagenSeleccionada(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.imagenSeleccionada.set(file);
      console.log('Archivo seleccionado:', file.name);
      this.obtenerFotoPreview(file)
    }
  }

  obtenerFotoPreview(file: File) {
    const lector = new FileReader();
    lector.onload = () => {
      this.fotoPreview.set(lector.result);
    };
    lector.readAsDataURL(file);
  }

  cerrarSesion() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Sesión cerrada exitosamente');
        this.router.navigate(['/']);
        this.usuarioService.clearUsuario();

      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
      }
    });
  }

  abrirModal() {
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  actualizarUsuarioClick() {
    if (this.nombreFormControl().invalid) {
      alert('Error');
      return;
    }

    // Si hay una imagen nueva, primero la subimos
    if (this.imagenSeleccionada() != null) {
      this.enviarImagen(this.imagenSeleccionada() as File).subscribe({
        next: (data) => {
          const nuevaURL = data.data.url; // URL de la nueva imagen
          this.usuarioService.actualizarNombreYfotoUsuario(this.nombreFormControl().value ?? '', nuevaURL).subscribe({
            next: () => this.finalizarGuardado(nuevaURL),
            error: (err) => console.error('Error al guardar con nueva imagen:', err)
          });
        },
        error: (err) => console.error('Error al subir la imagen:', err)
      });
    } else {
      // Si no hay imagen nueva
      this.usuarioService.actualizarNombreYfotoUsuario(this.nombreFormControl()?.value ?? '', this.usuario().fotoURL ? String(this.usuario().fotoURL) : "").subscribe({
        next: () => this.finalizarGuardado(this.usuario().fotoURL ? String(this.usuario().fotoURL) : ""),
        error: (err) => console.error('Error al guardar sin imagen nueva:', err)
      });
    }
  }

  finalizarGuardado(fotoURL: string) {
    this.guardado.set(true);
    setTimeout(() => (this.guardado.set(false)), 2000);

    this.usuarioService.updateUsuario("nombre", this.nombreFormControl().value)
    this.usuarioService.updateUsuario("fotoURL", fotoURL)
  }

  obtenerPreguntasDificilesGanadas(arrayIdPreguntas: number[] | any[]) {
    this.preguntaService.obtenerPreguntasDificiles(arrayIdPreguntas).subscribe((preguntasDificiles: Pregunta[]) => {
      this.preguntasDificilesGanadas.set(preguntasDificiles.length)
    })
  }


  enviarImagen(imagen: File): Observable<any> {
    const formData = new FormData();
    formData.append("image", imagen)
    return this.imagenService.enviarImagen(formData)
  }


}

