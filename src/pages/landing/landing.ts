import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})

export class Landing {

  constructor(private router: Router) { }

  irHaciaLogin() {
    this.router.navigate(["/login"])
  }
}
