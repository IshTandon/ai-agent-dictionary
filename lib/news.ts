import fs from 'fs';
import path from 'path';

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  published_at: string;
}

const NEWS_PATH = path.join(process.cwd(), 'content/news/latest.json');

export function getLatestNews(): NewsItem[] {
  try {
    const raw = fs.readFileSync(NEWS_PATH, 'utf-8');
    return JSON.parse(raw) as NewsItem[];
  } catch {
    return [];
  }
}
