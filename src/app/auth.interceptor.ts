import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const userInfo = this.userService.getUserInfo();
    const isLoggedIn = this.userService.isAuthenticated();
    if (isLoggedIn && userInfo) {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${userInfo.authData}`
        }
      });
    }
    return next.handle(request);
  }
}