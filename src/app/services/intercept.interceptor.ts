import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { HelperService } from './helper.service';
import Swal from 'sweetalert2';

const url = 'https://passwordcraftsman.onrender.com/api'

@Injectable()
export class InterceptInterceptor implements HttpInterceptor {

  constructor(private helper: HelperService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    if (request.url.startsWith(`${url}/api/login`) || request.url.startsWith(`${url}/sign-up`)) {
      console.log('login');

      return next.handle(request).pipe(
        map((event:HttpEvent<any>)=>{
          if(event instanceof HttpResponse){
            if(event.status == 200){
              Swal.fire('Success','Status is 200','success')
            }
          }
          return event
        })
      )
    } else {
      console.log('not login');
      const user = this.helper.getToken()

      const localToken = user?.token

      if (localToken) {

        const modRequest = request.clone({
          headers: request.headers.set('authorization', `${localToken.split(' ')[1]}`)
        })
        return next.handle(modRequest).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              if (event.status == 200) {
                Swal.fire('Success', 'Status is 200', 'success')
              }
            }
            return event;
          })
        );
      } else {
        return next.handle(request).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              if (event.status == 200) {
                Swal.fire('Success', 'Status is 200', 'success')
              }
            }
            return event;
          })
        );
      }
    }
  }
}
