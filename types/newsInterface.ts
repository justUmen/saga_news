export interface NewsArticle {
  source: { id: string; name: string };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface NewsData {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

//REDUX NEWS STATE
export interface NewsState {
  loading: boolean;
  newsData: NewsData | null;
  error: string | null;
}
export interface NewsError {
  name: "NewsError";
  error: string | null;
}