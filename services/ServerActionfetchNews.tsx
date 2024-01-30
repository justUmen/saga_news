"use server"; //Server Actions <3

import { NewsData, NewsError } from "../types/newsInterface";
const API_KEY = process.env.NEWS_API_KEY;

const NB_ITEMS = 20;

//Throttle the API calls, external API, and only one API key... :'(
let lastFetchTimestamp = 0;

export async function ServerActionfetchNews(
  page: number,
  query: string,
  language: string
): Promise<NewsData | NewsError> {
  const currentTimestamp = Date.now();
  // Check if the last fetch was less than X milliseconds ago
  const delta = currentTimestamp - lastFetchTimestamp;
  if (delta < 500) { //Reduce from 5000 to 500 (allow faster for testing) What is reasonable ? No idea... :p
    console.log(`API Fetching news for page ${page} and query ${query} (Time : ${delta} > 1000)`); //BAD
    return { name:"NewsError", error: "please wait" };
  }
  console.log(`API Fetching news for page ${page} and query ${query} (Time : ${delta} > 1000)`); //GOOD
  
  //Default search is from /top-headlines (with current Language)
  let baseUrl;
  if(query === "") {
      //TODO cache the top-headlines for each language
      baseUrl = `https://newsapi.org/v2/top-headlines?language=${language}&apiKey=${API_KEY}&pageSize=${NB_ITEMS}&page=${page}`;
  } else {
      baseUrl = `https://newsapi.org/v2/everything?language=${language}&apiKey=${API_KEY}&pageSize=${NB_ITEMS}&page=${page}`;
  }
  
  const searchQuery = query ? `&q=${encodeURIComponent(query)}` : "";
  const url = `${baseUrl}${searchQuery}`;
  console.log(url); //With API key  :p, can check or use (ctrl+click) for testing purposes
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const theError = `Error fetching data: ${response.statusText}`; // (1) - network-related errors
      console.error(theError);
      return { name:"NewsError", error: "network error" };
    }
    const data: NewsData = await response.json();
    lastFetchTimestamp = Date.now();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      const theError = `[fetchNewsQuery] An unexpected error occurred while fetching data: ${error.message}`; // (2) - data fetching issue
      console.error(theError);
      return { name:"NewsError", error: "unexpected error" };
    }
    else {
      const theError = `[fetchNewsQuery] An unexpected non-Error object was thrown`; // Unknown issue
      console.error(theError);
      return { name:"NewsError", error: "unexpected non-error" };
    }
  }
}
