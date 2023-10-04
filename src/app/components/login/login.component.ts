import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUser } from 'src/app/interfaces/user';
import { HelperService } from 'src/app/services/helper.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpService,
    private formBuilder: FormBuilder,
    private router: Router,
    private helper: HelperService) { }

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  isSubmitted = false
  passWordErr = ''

  ngOnInit(): void {
    if (this.helper.getToken()) {
      this.router.navigate([''])
    }
  }

  login() {
    const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-+])/;
    if (!regex.test(this.loginForm.value.password as string)) {
      return false
    } else {
      return true
    }
  }

  onSubmit() {
    this.isSubmitted = true

    if (!this.login()) {
      this.passWordErr = 'Password Checking failed \n Must include Capital letter, Small , number and symbol'
      return false
    }
    if (this.loginForm.valid) {
      this.http.login(this.loginForm.value as LoginUser).subscribe(
        result => {
          console.log(result);
          this.helper.setToken(result)
          this.router.navigate([''])
        }, ((err) => {
          this.passWordErr = err.error.error
          console.log(err);
        })
      )
      return true
    } else {

      this.passWordErr = 'Invalid Credentials'
      return false
    }
  }

}
