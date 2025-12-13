import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NewsService } from '../../services/news.service';
import { NewsItem } from '../../models/news.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  headlineNews = signal<NewsItem[]>([]);
  popularNews = signal<NewsItem[]>([]);
  recommendedNews = signal<NewsItem[]>([]);
  allRecommendedNews = signal<NewsItem[]>([]);
  currentSlide = signal(0);
  currentPage = signal(1);
  itemsPerPage = 8;
  isLoading = signal(true);
  searchQuery = signal<string>('');

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.isLoading.set(true);
    console.log('Starting to load news...');
    
    this.newsService.getNationalNews().subscribe({
      next: (response) => {
        console.log('Headline response:', response);
        if (response.data && response.data.length > 0) {
          this.headlineNews.set(response.data.slice(0, 5));
          console.log('Headline news loaded:', this.headlineNews());
        } else {
          console.warn('No headline data received');
        }
      },
      error: (error) => {
        console.error('Error loading headline:', error);
        console.error('Error details:', error.message, error.status);
      }
    });

    this.newsService.getLatestNews().subscribe({
      next: (response) => {
        console.log('Popular response:', response);
        if (response.data && response.data.length > 0) {
          this.popularNews.set(response.data.slice(0, 3));
          console.log('Popular news loaded:', this.popularNews());
        } else {
          console.warn('No popular data received');
        }
      },
      error: (error) => {
        console.error('Error loading popular news:', error);
        console.error('Error details:', error.message, error.status);
      }
    });

    this.newsService.getNationalNews().subscribe({
      next: (response) => {
        console.log('Recommended response:', response);
        if (response.data && response.data.length > 0) {
          this.allRecommendedNews.set(response.data);
          this.recommendedNews.set(response.data);
          console.log('Recommended news loaded:', this.recommendedNews().length, 'items');
          this.isLoading.set(false);
        } else {
          console.warn('No recommended data received');
          this.isLoading.set(false);
        }
      },
      error: (error) => {
        console.error('Error loading recommended news:', error);
        console.error('Error details:', error.message, error.status);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    this.searchQuery.set(query);
    this.currentPage.set(1);

    if (query.trim() === '') {
      this.recommendedNews.set(this.allRecommendedNews());
    } else {
      const filtered = this.allRecommendedNews().filter(news => 
        news.title.toLowerCase().includes(query) ||
        news.contentSnippet.toLowerCase().includes(query)
      );
      this.recommendedNews.set(filtered);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  }

  nextSlide() {
    const maxSlide = this.headlineNews().length - 1;
    if (this.currentSlide() < maxSlide) {
      this.currentSlide.update(val => val + 1);
    }
  }

  prevSlide() {
    if (this.currentSlide() > 0) {
      this.currentSlide.update(val => val - 1);
    }
  }

  get paginatedRecommendedNews() {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.recommendedNews().slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.recommendedNews().length / this.itemsPerPage);
  }

  get showingTo() {
    return Math.min(this.currentPage() * this.itemsPerPage, this.recommendedNews().length);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }

  encodeLink(link: string): string {
    return encodeURIComponent(link);
  }

  getImageUrl(newsItem: NewsItem): string {
    return newsItem.image?.large || newsItem.image?.small || 'https://via.placeholder.com/637x417';
  }

  getSmallImageUrl(newsItem: NewsItem): string {
    return newsItem.image?.small || newsItem.image?.large || 'https://via.placeholder.com/147x128';
  }
}
