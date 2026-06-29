import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
export class NewsFeed {
  @ViewChild('postFileInput') postFileInput!: ElementRef;
  
  isLoggedIn: boolean = true;

  newPostText: string = '';
  newPostImagePath: string = '';
  newPostImagePreview: string = '';
  nextId: number = 3;

  get canAddPost(): boolean {
    return this.newPostText.trim().length > 0 || 
           !!this.newPostImagePreview || 
           this.newPostImagePath.trim().length > 0;
  }

  posts: Post[] = [
    {
      id: 1,
      author: 'Enotovod',
      avatar: 'https://i.pravatar.cc/40?img=1',
      date: '13.06.2019 в 20:15',
      text: 'Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text.',
      image: 'assets/images/Surfer.jpg',      likes: 100,
      isLiked: false
    },
    {
      id: 2,
      author: 'SurferGirl',
      avatar: 'https://i.pravatar.cc/40?img=5',
      date: '14.06.2019 в 10:30',
      text: 'Поймала отличную волну сегодня!',
      image: '',
      likes: 42,
      isLiked: true
    }
  ];

  triggerPostFileInput() {
    this.postFileInput.nativeElement.click();
  }

  onPostFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.newPostImagePath = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newPostImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addPost() {
    if (!this.canAddPost) return;
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU') + ' в ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    // Определяем источник картинки
    let imageToUse = '';
    
    if (this.newPostImagePreview) {
      // Если выбран файл - используем base64
      imageToUse = this.newPostImagePreview;
    } else if (this.newPostImagePath.trim()) {
      // Если введен путь - используем его как есть (для assets или URL)
      imageToUse = this.newPostImagePath.trim();
    }

    const newPost: Post = {
      id: this.nextId++,
      author: 'Nikolpix',
      avatar: 'https://i.pravatar.cc/40?img=3',
      date: dateStr,
      text: this.newPostText,
      image: imageToUse,
      likes: 0,
      isLiked: false
    };

    console.log('New post image:', imageToUse);

    this.posts.unshift(newPost);
    this.newPostText = '';
    this.newPostImagePath = '';
    this.newPostImagePreview = '';
  }

  toggleLike(post: Post) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}