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
  isPasswordValid: boolean = false;

  constructor(private router: Router) {}

  onPassword() {
    this.isPasswordValid = this.password.length >= 6;
  }

  onLogin() {
    if (!this.nickname || !this.password) {
      alert('Заполните все поля');
      return;
    }
    if (!this.isPasswordValid) {
      alert('Пароль должен быть минимум 6 символов');
      return;
    }
    console.log('Никнейм:', this.nickname);
    console.log('Пароль:', this.password);
    this.router.navigate(['/feed']);
  }
}