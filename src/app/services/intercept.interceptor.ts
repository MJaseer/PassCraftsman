import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HelperService } from './helper.service';

const url = 'http://localhost:5000/api'

@Injectable()
export class InterceptInterceptor implements HttpInterceptor {

  constructor(private helper: HelperService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith(`${url}/api/login`) || request.url.startsWith(`${url}/sign-up`)) {
      return next.handle(request)
      
    } else {
      const user = this.helper.getToken()

      const localToken = user?.token
      
      if (localToken) {

        const modRequest = request.clone({
          headers: request.headers.set('authorization', `${localToken.split(' ')[1]}`)
        })
        return next.handle(modRequest);
      } else {
        return next.handle(request)
      }
    }
  }
}
