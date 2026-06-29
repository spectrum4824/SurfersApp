import { Routes } from '@angular/router';
import { Authorization } from './authorization/authorization';
import { Registration } from './registration/registration';
import { NewsFeed } from './newsfeed/newsfeed';

export const routes: Routes = [
  { path: 'login', component: Authorization },
  { path: 'registration', component: Registration },
  { path: 'newsfeed', component: NewsFeed },
  { path: 'feed', redirectTo: '/newsfeed', pathMatch: 'full' },
  { path: '', redirectTo: '/newsfeed', pathMatch: 'full' }
];