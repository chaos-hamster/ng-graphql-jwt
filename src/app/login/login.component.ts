import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ILoginDetails } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private authservice: AuthService,
    private formBuilder: FormBuilder,
    private router: Router) {
      this.form = this.formBuilder.group({
        email: '',
        password: ''
      });
     }

  ngOnInit(): void {
  }

  submit() {
    const details: ILoginDetails = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    }

    this.authservice.signin(details).subscribe(auth => {
      this.router.navigate(['/']);
      // console.log(auth?.user.username);
      // this.authservice.refresh().subscribe(auth => {
      //   console.log(auth?.user.username);
      // });
    });    
  }
}
