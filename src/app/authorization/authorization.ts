import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-authorization',
  imports: [FormsModule],
  templateUrl: './authorization.html',
  styleUrl: './authorization.css'
})
export class Authorization {
  nickname: string = '';
  password: string = '';
  
  showPassword: boolean = false;
  
  showEmptyFieldsError: boolean = false;
  showPasswordError: boolean = false;
  serverError: string = '';
  isLoading: boolean = false;
  showLoginNotFoundError: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToRegistration() {
    this.router.navigate(['/registration']);
  }

  onClearField(field: string) {
    if (field === 'nickname') {
      this.showLoginNotFoundError = false;
    }
    if (field === 'password') {
      this.showPasswordError = false;
    }
    this.showEmptyFieldsError = false;
    this.serverError = '';
  }

  get isEmptyFields(): boolean {
    return !this.nickname || !this.password;
  }

  getNicknameBorderColor(): string {
    if ((this.showEmptyFieldsError && !this.nickname) || this.showLoginNotFoundError) return 'red';
    return '#ccc';
  }

  getPasswordBorderColor(): string {
    if (this.showEmptyFieldsError && !this.password) return 'red';
    if (this.showPasswordError) return 'red';
    return '#ccc';
  }

  onLogin() {
    this.showEmptyFieldsError = false;
    this.showPasswordError = false;
    this.showLoginNotFoundError = false;
    this.serverError = '';

    if (this.isEmptyFields) {
      this.showEmptyFieldsError = true;
      return;
    }

    this.isLoading = true;

    const errorSub = this.userService.errors.subscribe((error: any) => {
      this.isLoading = false;
      console.log('Ошибка получена:', error);
      console.log('Статус ошибки:', error.status);
      if (error.status === 404) {
        this.showLoginNotFoundError = true;
        this.showPasswordError = false;
      } else if (error.status === 401) {
        this.showPasswordError = true;
        this.showLoginNotFoundError = false;
      } else {
        this.serverError = 'Ошибка сервера. Попробуйте позже.';
      }
      this.cdr.detectChanges();
      errorSub.unsubscribe();
    });

    this.userService.login(this.nickname, this.password);
    
    setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.serverError = 'Превышено время ожидания';
      }
    }, 10000);
  }
}