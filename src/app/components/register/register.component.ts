import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupUser } from 'src/app/interfaces/user';
import { HelperService } from 'src/app/services/helper.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private http: HttpService,
    private router: Router,
    private helper:HelperService) { }

  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    userName: ['',Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

  isSubmitted = false
  passWordErr = ''
  confirmPass = ''

  ngOnInit(): void {
    if (this.helper.getToken()) {
      this.router.navigate([''])
    }
  }

  login() {
    const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-+])/;
    if (!regex.test(this.registerForm.value.password as string)) {
      return false
    } else {
      return true
    }
  }

  onSubmit() {

    if (!this.login()) {
      console.log('rong');
      
      this.passWordErr = 'Password Checking failed \n Must include Capital letter, Small , number and symbol'
      return false
    }
    if (this.registerForm.valid) {
      console.log('cu');
      
      this.http.register(this.registerForm.value as SignupUser).subscribe(
        result => {
          console.log(result);
          this.router.navigate(['/login'])
        }, ((err) => {
          this.passWordErr = err.error.error
          console.log(err);
        })
      )
      this.isSubmitted = true
      return true
    } else {

      this.passWordErr = 'Invalid Credentials'
      this.isSubmitted = true

      return false
    }

  }


}
