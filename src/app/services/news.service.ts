import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { NewsResponse, NewsCategory } from '../models/news.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cnn-news`;

  getNewsByCategory(category: NewsCategory): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(`${this.baseUrl}/${category}`);
  }

  getLatestNews(): Observable<NewsResponse> {
    return this.getNewsByCategory('nasional');
  }

  getNationalNews(): Observable<NewsResponse> {
    return this.getNewsByCategory('nasional');
  }

  getInternationalNews(): Observable<NewsResponse> {
    return this.getNewsByCategory('internasional');
  }

  getEconomyNews(): Observable<NewsResponse> {
    return this.getNewsByCategory('ekonomi');
  }

  getSportsNews(): Observable<NewsResponse> {
    return this.getNewsByCategory('olahraga');
  }

  getTechnologyNews(): Observable<NewsResponse> {
    return this.getNewsByCategory('teknologi');
  }

  getEntertainmentNews(): Observable<NewsResponse> {
    return this.getNewsByCategory('hiburan');
  }

  getLifestyleNews(): Observable<NewsResponse> {
    return this.getNewsByCategory('gaya-hidup');
  }

  getTerpopuler(): Observable<NewsResponse> {
    return this.getNewsByCategory('nasional');
  }

  getHeadline(category: NewsCategory): Observable<NewsResponse> {
    return this.getNewsByCategory(category);
  }

  getRecommended(): Observable<NewsResponse> {
    return this.getNewsByCategory('internasional');
  }
}
