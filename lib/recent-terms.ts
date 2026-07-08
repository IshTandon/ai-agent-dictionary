import fs from 'fs';
import path from 'path';

import { Term } from './types';

const TERMS_DIR = path.join(process.cwd(), 'content/terms');

export function getRecentTerms(count: number = 6): Term[] {
  const files = fs.readdirSync(TERMS_DIR).filter(f => f.endsWith('.json'));

  const withMtime = files.map(f => {
    const fullPath = path.join(TERMS_DIR, f);
    const stat = fs.statSync(fullPath);
    return { file: f, mtime: stat.mtimeMs };
  });

  withMtime.sort((a, b) => b.mtime - a.mtime);

  return withMtime.slice(0, count).map(({ file }) => {
    const raw = fs.readFileSync(path.join(TERMS_DIR, file), 'utf-8');
    return JSON.parse(raw) as Term;
  });
}
