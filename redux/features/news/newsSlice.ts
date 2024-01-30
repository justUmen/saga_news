import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewsData, NewsState } from "@/types/newsInterface";

// NewsState moved to newsInterface.ts instead.
// interface NewsState {
//   loading: boolean;
//   newsData: NewsData | null;
//   error: string | null;
// }

const initialState: NewsState = {
  loading: false,
  newsData: null,
  error: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    resetNewsData: () => initialState,
    resetError: (state) => {
      state.error = null;
    },
    fetchNewsStart: (state) => {
      state.loading = true;
    },
    fetchNewsSuccess: (state, action: PayloadAction<NewsData>) => {
      state.loading = false;
      // If newsData is not null, update articles while filtering out duplicates
      // (It can happen with related searches, example : "docker" and "kubernetes" an article can be in both.)
      if (state.newsData) {
        const existingUrls = new Set(state.newsData.articles.map(article => article.url));
        const uniqueArticles = action.payload.articles.filter(article => !existingUrls.has(article.url));
        state.newsData.articles = [...state.newsData.articles, ...uniqueArticles];
      } else {
        // If newsData is null, initialize it with the payload
        state.newsData = action.payload;
      }
    },
    fetchNewsFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchNewsSuccess, fetchNewsFail, resetNewsData, resetError } = newsSlice.actions;
export const fetchNewsStart = createAction<{ page: number, query: string, language: string }>('news/fetchNewsStart');
export default newsSlice.reducer;
