import { Routes } from '@angular/router';
import { Registration } from './registration/registration';
import { Authorization } from './authorization/authorization';
import { Newsfeed } from './newsfeed/newsfeed';

export const routes: Routes = [
  { path: '', component: Newsfeed },
  { path: 'login', component: Authorization },
  { path: 'registration', component: Registration }
];

