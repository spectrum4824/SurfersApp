import { Component, ViewChild, ElementRef, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { ChangeDetectorRef } from '@angular/core';

interface Post {
  id: number;
  author: string;
  avatar: string;
  date: string;
  text: string;
  image: string;
  likes: number;
  isLiked: boolean;
}

@Component({
  standalone: true,
  selector: 'app-newsfeed',
  imports: [FormsModule],
  templateUrl: './newsfeed.html',
  styleUrl: './newsfeed.css'
})
export class NewsFeed implements OnInit {
  @ViewChild('postFileInput') postFileInput!: ElementRef;
  
  isLoggedIn: boolean = false;

  newPostText: string = '';
  newPostImagePath: string = '';
  newPostImagePreview: string = '';
  selectedFile: File | null = null;

  posts: Post[] = [];
  isLoading: boolean = false;

  get canAddPost(): boolean {
    return this.newPostText.trim().length > 0 || !!this.selectedFile;
  }

  constructor(
    private http: HttpClient,
    @Inject('BASE_API_URL') private baseUrl: string,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.userService.isAuthenticated();
    
    // Подписка на изменения авторизации
    this.userService.authChanged.subscribe(() => {
      this.isLoggedIn = this.userService.isAuthenticated();
    });
    
    // Загружаем посты
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading = true;
    this.http.get(this.baseUrl + '/Posts').subscribe({
      next: (data: any) => {
        console.log('Посты загружены:', data);
        this.posts = [...data.map((p: any) => {
          // Формируем URL аватарки
          let avatarUrl = ''; // заглушка по умолчанию
          if (p.avatar) {
            if (p.avatar.startsWith('http')) {
              avatarUrl = p.avatar; // полный URL
            } else {
              avatarUrl = `http://localhost:5001/static/img/${p.avatar}`; // локальный файл
            }
          }
          
          // Формируем URL картинки поста
          let imageUrl = '';
          if (p.image) {
            if (p.image.startsWith('http')) {
              imageUrl = p.image; // полный URL
            } else {
              imageUrl = `http://localhost:5001/static/img/${p.image}`; // локальный файл
            }
          }
          
          return {
            id: p.id,
            author: p.author,
            avatar: avatarUrl,
            date: new Date(p.date).toLocaleDateString('ru-RU') + ' в ' + new Date(p.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            text: p.text,
            image: imageUrl,
            likes: p.likes,
            isLiked: false
          };
        })];
        this.cdr.detectChanges();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки постов:', err);
        this.isLoading = false;
      }
    });
  }

  triggerPostFileInput() {
    this.postFileInput.nativeElement.click();
  }

  onPostFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      this.newPostImagePath = file.name;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newPostImagePreview = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  addPost() {
    if (!this.canAddPost) return;

    const formData = new FormData();
    formData.append('Text', this.newPostText);
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.http.post(this.baseUrl + '/Posts', formData).subscribe({
      next: () => {
        // После добавления перезагружаем список
        this.loadPosts();
        this.newPostText = '';
        this.newPostImagePath = '';
        this.newPostImagePreview = '';
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Ошибка добавления поста:', err);
      }
    });
  }

  toggleLike(post: Post) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    this.cdr.detectChanges();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none'; // скрываем битую картинку в посте
  }

  onAvatarError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://i.pinimg.com/236x/1a/a4/ce/1aa4cedee524828a8ac40cb77adfa233.jpg'; // заглушка для аватара
  }
  
}