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
  
  showPassword: boolean = false;
  
  showEmptyFieldsError: boolean = false;
  showPasswordError: boolean = false;

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onClearField(field: string) {
    if (field === 'password') {
      this.showPasswordError = false;
    }
    this.showEmptyFieldsError = false;
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

    if (this.isEmptyFields) {
      this.showEmptyFieldsError = true;
      return;
    }

    if (this.password !== '123456') {
      this.showPasswordError = true;
      return;
    }

    console.log('Вход выполнен:', this.nickname);
    this.router.navigate(['/feed']);
  }
}