import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  
  // Флаги для отображения ошибок
  showEmptyFieldsError: boolean = false;
  showPasswordError: boolean = false;

  constructor(private router: Router) {}

  // Сброс ошибок при очистке поля
  onClearField(field: string) {
    if (field === 'password') {
      this.showPasswordError = false;
    }
    this.showEmptyFieldsError = false;
  }

  // Проверка заполненности обязательных полей
  get isEmptyFields(): boolean {
    return !this.nickname || !this.password;
  }

  // Цвет рамки для поля никнейма
  getNicknameBorderColor(): string {
    if (this.showEmptyFieldsError && !this.nickname) return 'red';
    return '#ccc';
  }

  // Цвет рамки для поля пароля
  getPasswordBorderColor(): string {
    if (this.showEmptyFieldsError && !this.password) return 'red';
    if (this.showPasswordError) return 'red';
    return '#ccc';
  }

  onLogin() {
    // Сбрасываем все ошибки
    this.showEmptyFieldsError = false;
    this.showPasswordError = false;

    // Проверка на пустые поля
    if (this.isEmptyFields) {
      this.showEmptyFieldsError = true;
      return;
    }

    // Здесь будет реальная проверка через сервер
    // Пока для демонстрации: пароль "123456" - пускаем
    if (this.password !== '123456') {
      this.showPasswordError = true;
      return;
    }

    // Успешный вход
    console.log('Вход выполнен:', this.nickname);
    this.router.navigate(['/feed']);
  }
}