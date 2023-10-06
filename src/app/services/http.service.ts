import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginUser, SignupUser, loginRes, passWord } from '../interfaces/user';

const url = 'http://localhost:5000/api'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  login(data: LoginUser) {
    return this.http.post<loginRes>(`${url}/login`, data, { withCredentials: true })
  }

  register(data: SignupUser) {
    return this.http.post(`${url}/sign-up`, data, { withCredentials: true })
  }

  savePassWord(data:passWord){
    return this.http.post<passWord>(`${url}/save-password`, data, { withCredentials: true })
  }

  fetchPassWord(){
    return this.http.get<passWord[]>(`${url}/fetch-saved-data`, { withCredentials: true })
  }

  deletePassWord(password:passWord){
    return this.http.delete<passWord[]>(`${url}/delete-saved-data`, { withCredentials: true })
  }

}
