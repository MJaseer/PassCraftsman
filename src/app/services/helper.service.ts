import { Injectable } from '@angular/core';
import { loginRes, passWord } from '../interfaces/user';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private router: Router) { }

  passWordArray: passWord[] = []

  setToken(data: loginRes) {
    localStorage.removeItem('data')
    return localStorage.setItem('data', JSON.stringify(data))
  }

  getToken(): (null | loginRes) {
    const data = localStorage.getItem('data');
    if (data) {
      return JSON.parse(data)
    }
    return null
  }

  deleteToken() {
    localStorage.removeItem('data')
    this.router.navigate(['/'])
  }

  isLoggedIn() {
    return this.getToken() !== null
  }

}
