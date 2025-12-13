import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  telusuri = ['Beranda', 'Kesehatan', 'Otomotif', 'Politik', 'Olahraga', 'Nasional', 'Internasional'];
  bantuan = ['Kontak Kami', 'Laporan Pembajakan', 'Kebijakan'];
}
