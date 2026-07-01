import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';
import { UserService } from '../user.service';
import { ChangeDetectorRef } from '@angular/core';

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
  selectedFile: File | null = null;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  showNicknameHint: boolean = false;
  showPasswordHint: boolean = false;

  showEmptyFieldsError: boolean = false;
  showNicknameTakenError: boolean = false;
  showEmailTakenError: boolean = false;
  showPasswordsMatchError: boolean = false;
  showNicknameLengthError: boolean = false;
  showPasswordLengthError: boolean = false;
  
  // Флаг загрузки
  isLoading: boolean = false;
  // Ошибка от сервера
  serverError: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_API_URL') private baseUrl: string,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  get hasEmptyRequiredFields(): boolean {
    return !this.nickname || !this.email || !this.password || !this.confirmPassword;
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  get isNicknameValid(): boolean {
    return this.nickname.length === 0 || (this.nickname.length >= 3 && this.nickname.length <= 20);
  }

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
    this.serverError = '';
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
      this.selectedFile = file;
      this.photoPath = file.name;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreviewUrl = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onRegister() {
    // Сбрасываем ошибки
    this.showEmptyFieldsError = false;
    this.showNicknameTakenError = false;
    this.showEmailTakenError = false;
    this.showPasswordsMatchError = false;
    this.showNicknameLengthError = false;
    this.showPasswordLengthError = false;
    this.serverError = '';

    // Проверки
    if (this.hasEmptyRequiredFields) {
      this.showEmptyFieldsError = true;
      return;
    }
    if (this.nickname.length < 3) {
      this.showNicknameLengthError = true;
      return;
    }
    if (this.password.length < 6) {
      this.showPasswordLengthError = true;
      return;
    }
    if (!this.passwordsMatch) {
      this.showPasswordsMatchError = true;
      return;
    }

    this.isLoading = true;

    // Собираем FormData
    const formData = new FormData();
    formData.append('Nickname', this.nickname);
    formData.append('Email', this.email);
    formData.append('Password', this.password);
    formData.append('FirstName', this.firstName);
    formData.append('LastName', this.lastName);
    formData.append('Contact', this.contact);
    formData.append('About', this.about);
    formData.append('Achievements', this.achievements);
    
    if (this.selectedFile) {
      formData.append('AvatarFile', this.selectedFile);
    }

    // Отправляем запрос
    this.http.post(this.baseUrl + '/Register', formData).subscribe({
      next: (user: any) => {
        this.isLoading = false;
        console.log('Регистрация успешна:', user);
        // Вызываем логин, он сам перекинет
        this.userService.login(this.nickname, this.password);
      },
      
      error: (error: any) => {
        this.isLoading = false;
        console.error('Ошибка регистрации:', error);
    
        if (error.status === 409) {
          if (error.error?.field === 'nickname') {
            this.showNicknameTakenError = true;
          } else if (error.error?.field === 'email') {
            this.showEmailTakenError = true;
          } else {
            this.serverError = 'Пользователь уже существует';
          }
        } else {
          this.serverError = 'Ошибка сервера. Попробуйте позже.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}