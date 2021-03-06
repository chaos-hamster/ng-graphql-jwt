import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ISignupDetails } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(
    private authservice: AuthService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.form = this.formBuilder.group({
      name: '',
      email: '',
      password: ''
    });
   }

  ngOnInit(): void {
  }

  submit(): void {
    const details: ISignupDetails = {
      username: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    }

    this.authservice.signup(details).subscribe(auth => {
      this.router.navigate(['/login']);
      // console.log(auth?.user.username);
      // this.authservice.refresh().subscribe(auth => {
      //   console.log(auth?.user.username);
      // });
    });    
  }
}
