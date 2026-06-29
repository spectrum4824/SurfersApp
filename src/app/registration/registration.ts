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

  photoPath: string = '';
  photoPreviewUrl: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  showNicknameHint: boolean = false;
  showPasswordHint: boolean = false;

  showEmptyFieldsError: boolean = false;
  showNicknameTakenError: boolean = false;
  showEmailTakenError: boolean = false;
  showPasswordsMatchError: boolean = false;
  
  // Новые флаги для валидации
  showNicknameLengthError: boolean = false;
  showPasswordLengthError: boolean = false;

  constructor(private router: Router) {}

  get hasEmptyRequiredFields(): boolean {
    return !this.nickname || !this.email || !this.password || !this.confirmPassword;
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  // Проверка длины никнейма (от 3 до 20)
  get isNicknameValid(): boolean {
    return this.nickname.length === 0 || (this.nickname.length >= 3 && this.nickname.length <= 20);
  }

  // Проверка длины пароля (от 6 до 20)
  get isPasswordValid(): boolean {
    return this.password.length === 0 || (this.password.length >= 6 && this.password.length <= 20);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onClearField(field: string) {
    if (field === 'nickname') {
      this.showNicknameTakenError = false;
      this.showNicknameLengthError = false;
    }
    if (field === 'email') {
      this.showEmailTakenError = false;
    }
    if (field === 'password' || field === 'confirmPassword') {
      this.showPasswordsMatchError = false;
      this.showPasswordLengthError = false;
    }
    this.showEmptyFieldsError = false;
  }

  getNicknameBorderColor(): string {
    if ((this.showEmptyFieldsError && !this.nickname) || this.showNicknameTakenError || this.showNicknameLengthError) return 'red';
    return '#ccc';
  }

  getEmailBorderColor(): string {
    if ((this.showEmptyFieldsError && !this.email) || this.showEmailTakenError) return 'red';
    return '#ccc';
  }

  getPasswordBorderColor(): string {
    if ((this.showEmptyFieldsError && !this.password) || this.showPasswordsMatchError || this.showPasswordLengthError) return 'red';
    return '#ccc';
  }

  getConfirmPasswordBorderColor(): string {
    if ((this.showEmptyFieldsError && !this.confirmPassword) || this.showPasswordsMatchError) return 'red';
    return '#ccc';
  }

  triggerFileInput() {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.photoPath = file.name;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onRegister() {
    // Сбрасываем все ошибки
    this.showEmptyFieldsError = false;
    this.showNicknameTakenError = false;
    this.showEmailTakenError = false;
    this.showPasswordsMatchError = false;
    this.showNicknameLengthError = false;
    this.showPasswordLengthError = false;

    // Проверка на пустые поля
    if (this.hasEmptyRequiredFields) {
      this.showEmptyFieldsError = true;
      return;
    }

    // Проверка длины никнейма (от 3 символов)
    if (this.nickname.length < 3) {
      this.showNicknameLengthError = true;
      return;
    }

    // Проверка длины пароля (от 6 символов)
    if (this.password.length < 6) {
      this.showPasswordLengthError = true;
      return;
    }

    // Проверка на совпадение паролей
    if (!this.passwordsMatch) {
      this.showPasswordsMatchError = true;
      return;
    }

    // Заглушки для серверных проверок
    if (this.nickname === 'test') {
      this.showNicknameTakenError = true;
      return;
    }

    if (this.email === 'test@test.ru') {
      this.showEmailTakenError = true;
      return;
    }

    // Успешная регистрация
    console.log('Регистрация успешна:', this.nickname);
    console.log('Фото:', this.photoPath);
    this.router.navigate(['/feed']);
  }
}