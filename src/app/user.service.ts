import { Injectable, Output, EventEmitter, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface UserInfo {
  login: string;
  photo: string;
  authData: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  @Output() authChanged: EventEmitter<any> = new EventEmitter();
  @Output() errors: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('BASE_API_URL') private baseUrl: string
  ) { }

  login(login: string, password: string) {
    const body = {
      login: login,
      password: password
    };

    this.http.post(this.baseUrl + '/Login', body).subscribe({
      next: (user: any) => {
        const authData = window.btoa(login + ':' + password);
        const photoUrl = user.photo ? `http://localhost:5001/static/img/${user.photo}` : '';
        const userInfo: UserInfo = { login: login, photo: photoUrl, authData: authData };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('isAuthenticated', 'true');

        this.authChanged.emit();
        this.router.navigate(['/newsfeed']);
      },
      error: (e: any) => {
        this.errors.emit(e);
      }
    });
  }

  logout() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isAuthenticated');

    this.authChanged.emit();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') !== null;
  }

  getUserInfo(): UserInfo | null {
    return JSON.parse(localStorage.getItem('userInfo') || 'null');
  }
}