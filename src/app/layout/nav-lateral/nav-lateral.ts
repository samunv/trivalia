import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-lateral',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './nav-lateral.html',
  styleUrl: './nav-lateral.css'
})
export class NavLateral {
  constructor(public router: Router) {


  }
  irHaciaAprender() {
    this.router.navigate(['/aprender']);
  }
}
