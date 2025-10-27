import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-audio-component',
  imports: [],
  templateUrl: './audio-component.html',
})
export class AudioComponent {
  @Input() audioArchivo: string = "";
  @Input() loop: boolean = false;
  private audio!: HTMLAudioElement;

  constructor() { }

  ngOnInit() {
    this.audio = new Audio(this.audioArchivo);
    this.audio.loop = this.loop; // para que suene continuamente
    this.audio.volume = 0.5;

    // Intentamos reproducir automáticamente
    this.audio.play().catch(err => {
      // Si el navegador bloquea autoplay, solo muestra un mensaje
      console.warn('Autoplay bloqueado, espera interacción del usuario', err);
    });
  }

  ngOnDestroy(){
    this.audio.pause()
  }
}
