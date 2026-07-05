import fs from 'fs';
import path from 'path';

import { Term } from './types';

const TERMS_DIR = path.join(process.cwd(), 'content/terms');

export function getAllTerms(): Term[] {
  const files = fs.readdirSync(TERMS_DIR).filter(f => f.endsWith('.json'));
  return files.map(f => {
    const raw = fs.readFileSync(path.join(TERMS_DIR, f), 'utf-8');
    return JSON.parse(raw) as Term;
  });
}

export function getTermBySlug(slug: string): Term | null {
  const filePath = path.join(TERMS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Term;
}

export function getTermsByCategory(category: string): Term[] {
  return getAllTerms().filter(t => t.category === category);
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(TERMS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}
