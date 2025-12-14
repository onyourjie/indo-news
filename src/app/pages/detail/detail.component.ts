import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  newsDetail = signal<any>(null);
  relatedNews = signal<any[]>([]);
  popularNews = signal<any[]>([]);
  category = signal<string>('');
  newsLink = signal<string>('');
  allNews = signal<any[]>([]);
  isLoading = signal(true);
  comments = signal<any[]>([
    {
      id: 1,
      author: 'UJANG YUSMEIDI S.P., M.Agr.',
      date: '28 Mar 2024 11:15',
      content: 'Mohon maaf, apakah sertifikatnya sudah tidak dapat diunduh ? Karena saya mau download ada konfirmasi bahwa TOTP aktivasi salah Bagaimana ya solusinya ?',
      replies: [
        {
          id: 2,
          author: 'DINA RIKHA RIYANAWATI, S.Pd',
          date: '28 Mar 2024 11:15',
          content: 'saya mengunduh sertifikatnya kok juga belumbisa'
        }
      ]
    }
  ]);

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}

  ngOnInit() {
    // Get params from route
    this.route.params.subscribe(params => {
      this.category.set(params['category']);
      this.newsLink.set(decodeURIComponent(params['id']));
      this.loadNewsDetail();
      this.loadRelatedNews();
      this.loadPopularNews();
    });
  }

  loadNewsDetail() {
    this.isLoading.set(true);
    const category = this.category() as any;
    this.newsService.getHeadline(category).subscribe({
      next: (response: any) => {
        this.allNews.set(response.data);
        const newsLink = this.newsLink();
        const foundNews = response.data.find((news: any) => news.link === newsLink);
        if (foundNews) {
          this.newsDetail.set(foundNews);
        } else {
          console.error('News not found with link:', newsLink);
        }
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading news detail:', error);
        this.isLoading.set(false);
      }
    });
  }

  loadRelatedNews() {
    const category = this.category() as any;
    this.newsService.getHeadline(category).subscribe({
      next: (response: any) => {
        this.relatedNews.set(response.data.slice(0, 4));
      },
      error: (error: any) => {
        console.error('Error loading related news:', error);
      }
    });
  }

  loadPopularNews() {
    this.newsService.getTerpopuler().subscribe({
      next: (response: any) => {
        this.popularNews.set(response.data.slice(0, 3));
      },
      error: (error: any) => {
        console.error('Error loading popular news:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  encodeLink(link: string): string {
    return encodeURIComponent(link);
  }

  getImageUrl(news: any): string {
    return news?.thumbnail || news?.image?.large || 'https://via.placeholder.com/800x400';
  }

  getSmallImageUrl(news: any): string {
    return news?.thumbnail || news?.image?.small || 'https://via.placeholder.com/300x200';
  }

  getProfilePicture(id: number): string {
    const profileIndex = (id % 3) + 1;
    return `assets/profile${profileIndex}.svg`;
  }
}
