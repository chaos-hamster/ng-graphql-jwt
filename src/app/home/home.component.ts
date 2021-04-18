import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  result: string = "";

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {
  }

  refresh() {
    this.result = "";
    this.authService.refresh().subscribe(u => {
      if (u) {
        this.result = u.token;
      }
    });
  }

  doSomething() {
    this.result = "";
    this.dataService.doSomething({something:"somethig!"})
      .subscribe(d => {
        this.result = d || "failed";
      })
  }
}
