import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { passWord } from 'src/app/interfaces/user';
import { HelperService } from 'src/app/services/helper.service';
import { HttpService } from 'src/app/services/http.service';

interface status {
  shape: string,
  color: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor(private messageService: NzMessageService,
    private formBuilder: FormBuilder,
    private http: HttpService,
    private helper: HelperService) { }

  password = "Generate Password"

  passToSave = this.formBuilder.group({
    appName: ['', [Validators.required, Validators.minLength(2)]],
    password: [this.password, Validators.required],
    userName: ['', [Validators.required, Validators.minLength(3)]]
  })

  isSubmitted = false
  passWordErr = ''

  isUpperCase = true
  isLowerCase = true
  isNumber = true
  isSpecialChar = true

  isAvailableCount = 3

  upperInclude = { shape: 'check-circle', color: '#52c41a' }
  lowerInclude = { shape: 'check-circle', color: '#52c41a' }
  numberInclude = { shape: 'check-circle', color: '#52c41a' }
  speialCharInclude = { shape: 'check-circle', color: '#52c41a' }

  passwordLength = 10

  numbers = "0123456789";
  upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  specialCharacters = "!@#$%^&*-_=~`|/:;,.";

  characterList = ''


  ngOnInit() {
    this.getPasswords()
  }

  changeItem(item: string) {

    const change = (type: status) => {

      if (type.color == '#ff0000') {
        this.isAvailableCount++
        return type = { shape: 'check-circle', color: '#52c41a' }
      } else {
        if (this.isAvailableCount < 1) {
          this.messageService.warning('Atleast One item required', { nzAnimate: true, nzDuration: 3000 })
          return type
        }
        this.isAvailableCount--
        return type = { shape: 'close-circle', color: '#ff0000' }
      }

    }

    switch (item) {
      case 'upper':
        this.isUpperCase = !this.isUpperCase
        this.upperInclude = change(this.upperInclude)
        break;
      case 'lower':
        this.isLowerCase = !this.isLowerCase
        this.lowerInclude = change(this.lowerInclude)
        break;
      case 'special':
        this.isSpecialChar = !this.isSpecialChar
        this.speialCharInclude = change(this.speialCharInclude)
        break;
      case 'number':
        this.isNumber != this.isNumber
        this.numberInclude = change(this.numberInclude)
        break;
    }

  }

  generate() {
    this.password = ''
    this.characterList = ''


    if (this.isLowerCase) {

      this.characterList += this.lowerCaseLetters
    }

    if (this.isNumber) {

      this.characterList += this.numbers
    }

    if (this.isSpecialChar) {

      this.characterList += this.specialCharacters
    }

    if (this.isUpperCase) {

      this.characterList += this.upperCaseLetters
    }

    let characterListLength = this.characterList.length;
    for (let i = 0; i < this.passwordLength; i++) {
      let randomIndex = Math.floor(Math.random() * characterListLength);
      this.password += this.characterList.charAt(randomIndex);
    }
  }

  handleCopyClick = () => {
    if (this.password.length > 0) {
      navigator.clipboard.writeText(this.password);
      this.messageService.success('Copied succesfully', { nzDuration: 3000, nzAnimate: true });
    }
  }

  savePassword() {
    this.passToSave.value.password = this.password
    console.log(this.passToSave.value);
    if (this.passToSave.valid) {
      this.http.savePassWord(this.passToSave.value as passWord).subscribe(
        result => {
          this.helper.passWordArray.push(result)
          console.log(result);
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

  getPasswords(){
    this.http.fetchPassWord().subscribe(
      result => {
        console.log(result);
      }
    )
  }

}
