import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(
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
    // this.http.post('http://localhost:3000/api/register', this.form.getRawValue())
    // .subscribe((res) => {
    //   console.log(res)
    //   this.router.navigate(['/login']);
    // });
  }
}
