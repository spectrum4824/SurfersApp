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

  constructor(private router: Router) {}

  get hasEmptyRequiredFields(): boolean {
    return !this.nickname || !this.email || !this.password || !this.confirmPassword;
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onClearField(field: string) {
    if (field === 'nickname') {
      this.showNicknameTakenError = false;
    }
    if (field === 'email') {
      this.showEmailTakenError = false;
    }
    if (field === 'password' || field === 'confirmPassword') {
      this.showPasswordsMatchError = false;
    }
    this.showEmptyFieldsError = false;
  }

  getNicknameBorderColor(): string {
    if ((this.showEmptyFieldsError && !this.nickname) || this.showNicknameTakenError) return 'red';
    return '#ccc';
  }

  getEmailBorderColor(): string {
    if ((this.showEmptyFieldsError && !this.email) || this.showEmailTakenError) return 'red';
    return '#ccc';
  }

  getPasswordBorderColor(): string {
    if ((this.showEmptyFieldsError && !this.password) || this.showPasswordsMatchError) return 'red';
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
    this.showEmptyFieldsError = false;
    this.showNicknameTakenError = false;
    this.showEmailTakenError = false;
    this.showPasswordsMatchError = false;

    if (this.hasEmptyRequiredFields) {
      this.showEmptyFieldsError = true;
      return;
    }

    if (!this.passwordsMatch) {
      this.showPasswordsMatchError = true;
      return;
    }

    if (this.nickname === 'test') {
      this.showNicknameTakenError = true;
      return;
    }

    if (this.email === 'test@test.ru') {
      this.showEmailTakenError = true;
      return;
    }

    console.log('Регистрация успешна:', this.nickname);
    console.log('Фото:', this.photoPath);
    this.router.navigate(['/feed']);
  }
}