export interface NewsItem {
  title: string;
  link: string;
  contentSnippet: string;
  isoDate: string;
  image?: {
    small?: string;
    large?: string;
  };
  description?: string;
}

export interface NewsResponse {
  message: string;
  total: number;
  data: NewsItem[];
}

export type NewsCategory = 
  | 'terbaru'
  | 'nasional' 
  | 'internasional' 
  | 'ekonomi' 
  | 'olahraga' 
  | 'teknologi' 
  | 'hiburan' 
  | 'gaya-hidup';
