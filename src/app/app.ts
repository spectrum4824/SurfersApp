import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isLoginPage: boolean = false;
  isRegistrationPage: boolean = false;
  isLoggedIn: boolean = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url === '/login';
      this.isRegistrationPage = event.url === '/registration';
    });
  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['/feed']);
  }
}