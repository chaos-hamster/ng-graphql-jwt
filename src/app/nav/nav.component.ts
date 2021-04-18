import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  
  isAuthenticated: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((isAuthenticated: boolean) =>
    {
      this.isAuthenticated = isAuthenticated;
    });
  }

  logout(): void {
    this.authService.signout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

}
