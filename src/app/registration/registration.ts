import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-registration',
  imports: [FormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})
export class Registration {
  nickname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  lastName: string = '';
  firstName: string = '';
  contact: string = '';
  about: string = '';
  achievements: string = '';

  constructor(private router: Router) {}
  onPasswordChange() {
    
    if (this.confirmPassword.length === 0) {
      return;
    }
  }
  isPasswordsMatch(): boolean {
  
    if (this.confirmPassword.length === 0) {
      return true;
    }
    return this.password === this.confirmPassword;
  }
  onRegister() {
    if (!this.nickname || !this.email || !this.password || !this.confirmPassword) {
      alert('Заполните все обязательные поля (*)');
      return;
    }
    if (!this.isPasswordsMatch()) {
      alert('Пароли не совпадают!');
      return;
    }
    if (this.password.length < 6) {
      alert('Пароль должен быть минимум 6 символов');
      return;
    }
    this.router.navigate(['/feed']);
  }
}