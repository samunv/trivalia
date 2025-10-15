import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Landing} from "./pages/landing/landing";
import { Login } from './pages/login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Landing, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('trivialia');
}
