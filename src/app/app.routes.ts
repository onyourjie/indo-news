import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'detail/:category/:id',
    loadComponent: () => import('./pages/detail/detail.component').then(m => m.DetailComponent)
  },
  {
    path: ':category',
    loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
