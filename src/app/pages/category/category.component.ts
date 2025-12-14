import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NewsService } from '../../services/news.service';
import { NewsItem, NewsCategory } from '../../models/news.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  category = signal<string>('');
  allNews = signal<NewsItem[]>([]);
  filteredNews = signal<NewsItem[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal(true);
  currentPage = signal(1);
  itemsPerPage = 12;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.route.url.subscribe(url => {
      const categoryParam = url[0]?.path || 'nasional';
      this.category.set(categoryParam);
      this.loadCategoryNews(categoryParam);
    });
  }

  loadCategoryNews(category: string) {
    this.isLoading.set(true);
    this.searchQuery.set(''); // reset kategori
    
    // Map category to service method
    let newsObservable;
    switch(category) {
      case 'nasional':
        newsObservable = this.newsService.getNationalNews();
        break;
      case 'internasional':
        newsObservable = this.newsService.getInternationalNews();
        break;
      case 'ekonomi':
        newsObservable = this.newsService.getEconomyNews();
        break;
      case 'olahraga':
        newsObservable = this.newsService.getSportsNews();
        break;
      case 'teknologi':
        newsObservable = this.newsService.getTechnologyNews();
        break;
      case 'hiburan':
        newsObservable = this.newsService.getEntertainmentNews();
        break;
      case 'gaya-hidup':
        newsObservable = this.newsService.getLifestyleNews();
        break;
      default:
        newsObservable = this.newsService.getNationalNews();
    }

    newsObservable.subscribe({
      next: (response) => {
        this.allNews.set(response.data);
        this.filteredNews.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading category news:', error);
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
      this.filteredNews.set(this.allNews());
    } else {
      const filtered = this.allNews().filter(news => 
        news.title.toLowerCase().includes(query) ||
        news.contentSnippet.toLowerCase().includes(query)
      );
      this.filteredNews.set(filtered);
    }
  }

  get paginatedNews() {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredNews().slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredNews().length / this.itemsPerPage);
  }

  get showingTo() {
    const to = this.currentPage() * this.itemsPerPage;
    return to > this.filteredNews().length ? this.filteredNews().length : to;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  encodeLink(link: string): string {
    return encodeURIComponent(link);
  }

  formatDate(isoDate: string): string {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  getImageUrl(news: NewsItem): string {
    return news.image?.large || news.image?.small || 'https://via.placeholder.com/800x400';
  }

  getCategoryTitle(): string {
    const categoryMap: { [key: string]: string } = {
      'nasional': 'Nasional',
      'internasional': 'Internasional',
      'ekonomi': 'Ekonomi',
      'olahraga': 'Olahraga',
      'teknologi': 'Teknologi',
      'hiburan': 'Hiburan',
      'gaya-hidup': 'Gaya Hidup'
    };
    return categoryMap[this.category()] || this.category();
  }
}
