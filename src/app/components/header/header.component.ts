import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuItems = [
    { label: 'Beranda', route: '/', category: 'beranda' },
    { label: 'Terbaru', route: '/terbaru', category: 'terbaru' },
    { label: 'Hiburan', route: '/hiburan', category: 'hiburan' },
    { label: 'Gaya Hidup', route: '/gaya-hidup', category: 'gaya-hidup' },
    { label: 'Olahraga', route: '/olahraga', category: 'olahraga' },
    { label: 'Nasional', route: '/nasional', category: 'nasional' },
    { label: 'Internasional', route: '/internasional', category: 'internasional' }
  ];
}
