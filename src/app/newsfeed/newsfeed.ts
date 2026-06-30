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
      avatar: 'https://i.pinimg.com/236x/13/fa/a6/13faa6b477fb99e0ee8303c812819ed9.jpg',
      date: '13.06.2019 в 20:15',
      text: 'Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text Sample text.',
      image: 'https://img.redbull.com/images/q_auto,f_auto/redbullcom/2015/06/16/1331729713294_2/5-%D1%81%D0%B0%D0%BC%D1%8B%D1%85-%D0%B7%D1%80%D0%B5%D0%BB%D0%B8%D1%89%D0%BD%D1%8B%D1%85-%D0%B2%D0%B0%D0%B9%D0%BF%D0%B0%D1%83%D1%82%D0%BE%D0%B2-%D0%B3%D0%BE%D0%B4%D0%B0.jpg', likes: 100,
      isLiked: false
    },
    {
      id: 2,
      author: 'SurferGirl',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Y9xHnB991npVGde0Nv54pSMh5Ce3HwDBmQ&s',
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