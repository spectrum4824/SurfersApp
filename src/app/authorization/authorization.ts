import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';

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

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToRegistration() {
    this.router.navigate(['/registration']);
  }

  onClearField(field: string) {
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
    if (this.showEmptyFieldsError && !this.nickname) return 'red';
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
    this.serverError = '';

    if (this.isEmptyFields) {
      this.showEmptyFieldsError = true;
      return;
    }

    this.isLoading = true;

    // Вызываем метод логина из UserService
    this.userService.login(this.nickname, this.password);
    
    // Подписываемся на ошибки
    const errorSub = this.userService.errors.subscribe((error: any) => {
      this.isLoading = false;
      if (error.status === 401) {
        this.serverError = 'Неверный логин или пароль';
      } else {
        this.serverError = 'Ошибка сервера. Попробуйте позже.';
      }
      errorSub.unsubscribe();
    });

    // Если логин успешный — isLoading выключится при переходе
    setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
      }
    }, 5000);
  }
}