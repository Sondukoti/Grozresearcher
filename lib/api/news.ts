import { fetchWithErrorHandling } from './fetch';
import type { NewsArticle } from '../types';

const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "ac59edc142204e15ade0aaf73a980739";

export async function fetchNewsData(query: string): Promise<NewsArticle[]> {
  try {
    // Use a more specific search query
    const searchQuery = encodeURIComponent(`${query} AND (technology OR science OR research)`);
    
    const data = await fetchWithErrorHandling(
      `${NEWS_API_URL}?q=${searchQuery}&sortBy=relevancy&pageSize=6&language=en&apiKey=${NEWS_API_KEY}`,
      {
        headers: {
          'Authorization': `Bearer ${NEWS_API_KEY}`,
        },
      }
    );
    
    if (!data.articles) {
      console.warn('No articles found in News API response');
      return [];
    }

    // Filter out articles without required fields
    return data.articles.filter((article: any) => 
      article.title && 
      article.description && 
      article.url
    );
  } catch (error) {
    console.error('News fetch error:', error);
    // Return empty array instead of throwing to prevent breaking the entire research
    return [];
  }
}