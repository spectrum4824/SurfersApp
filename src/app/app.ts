import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService, UserInfo } from './user.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isLoginPage: boolean = false;
  isRegistrationPage: boolean = false;
  isLoggedIn: boolean = false;
  userInfo: UserInfo | null = null;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url === '/login';
      this.isRegistrationPage = event.url === '/registration';
    });
  }

  ngOnInit() {
    this.updateAuthState();

    // Подписываемся на изменения авторизации
    this.userService.authChanged.subscribe(() => {
      this.updateAuthState();
    });
  }

  updateAuthState() {
    this.isLoggedIn = this.userService.isAuthenticated();
    this.userInfo = this.userService.getUserInfo();
  }

  logout() {
    this.userService.logout();
  }

  onAvatarError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://i.pinimg.com/236x/1a/a4/ce/1aa4cedee524828a8ac40cb77adfa233.jpg';
  }
}