import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { passWord } from 'src/app/interfaces/user';
import { HelperService } from 'src/app/services/helper.service';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';

interface status {
  shape: string,
  color: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit,OnDestroy {

  constructor(private messageService: NzMessageService,
    private formBuilder: FormBuilder,
    private http: HttpService,
    private helper: HelperService) { }

  password = "Generate Password"

  trackByFn( index: number, user: passWord) { return  user.appName }

  passToSave = this.formBuilder.group({
    appName: ['', [Validators.required, Validators.minLength(2)]],
    password: [this.password, Validators.required],
    userName: ['', [Validators.required, Validators.minLength(3)]]
  })

  isLoggedIn = this.helper.isLoggedIn()

  isSubmitted = false
  passWordErr = ''
  savePassWord: passWord[] = []

  private unsubscribeSubject!: Subject<void>; 

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

    if (this.helper.isLoggedIn()) {
      this.getPasswords()
    }

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
    if (!this.helper.isLoggedIn()) {
      Swal.fire('User Not Found', 'Please login to save user', 'error')
    }
    this.passToSave.value.password = this.password
    if (this.passToSave.valid) {
      this.http.savePassWord(this.passToSave.value as passWord).subscribe(
        result => {
          this.savePassWord.push(result)
          this.helper.passWordArray.push(result)
        }, ((err) => {
          this.passWordErr = err.error.error
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

  getPasswords() {
    this.unsubscribeSubject = new Subject();
    
    this.http.fetchPassWord().pipe(
      takeUntil(this.unsubscribeSubject)
    ) .subscribe(
        result => {
          this.savePassWord = result
        }
      )
  }

  sliderChange() {
    this.generate()
  }

  handleSavedCopyClick = (password: string) => {
    const data = this.savePassWord.find(item => item.password == password)
    if (data) {
      navigator.clipboard.writeText(data?.password);
      this.messageService.success('Copied succesfully', { nzDuration: 3000, nzAnimate: true });
    }
  }

  deleteItem(item: passWord) {
    this.http.deletePassWord(item).subscribe(
      result => {
        if (result) {
          this.savePassWord = result
          this.messageService.success('Deleted succesfully', { nzDuration: 3000, nzAnimate: true });
        } else {
          this.messageService.error('Delete Failed', { nzDuration: 3000, nzAnimate: true });
        }
      }
    )
  }

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

}
