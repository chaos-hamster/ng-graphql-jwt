import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitters';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  
  isAuthenticated: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((isAuthenticated: boolean) =>
    {
      this.isAuthenticated = isAuthenticated;
    });
  }

  logout(): void {
    // this.http.post('http://localhost:3000/api/logout', {}, {withCredentials: true})
    //   .subscribe(() => {
    //     this.isAuthenticated = false;
    //     this.router.navigate(['/login']);
    //   })
  }

}
