import { Component } from '@angular/core';

@Component({
  selector: 'app-audio',
  imports: [],
  templateUrl: './audio.html',
  styleUrl: './audio.css'
})
export class Audio {
  audioArchivo = "../../../assets/audio/musica.mp3";
  constructor() { }

}
