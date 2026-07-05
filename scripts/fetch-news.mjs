import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '..', 'content', 'news', 'latest.json');

async function fetchHackerNews() {
  const url = 'https://hn.algolia.com/api/v1/search?tags=story&query=AI+agents&hitsPerPage=20';
  const res = await fetch(url);
  const data = await res.json();

  return data.hits.map(hit => ({
    title: hit.title,
    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
    source: 'Hacker News',
    published_at: hit.created_at,
  }));
}

async function fetchTheDecoder() {
  const url = 'https://the-decoder.com/feed/';
  const res = await fetch(url);
  const xml = await res.text();

  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/);
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);

    const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : null;
    const link = linkMatch ? linkMatch[1] : null;
    const pubDate = pubDateMatch ? pubDateMatch[1] : null;

    if (title && link) {
      items.push({
        title,
        url: link,
        source: 'The Decoder',
        published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      });
    }
  }

  return items;
}

async function main() {
  const [hnItems, decoderItems] = await Promise.all([
    fetchHackerNews(),
    fetchTheDecoder(),
  ]);

  const merged = [...hnItems, ...decoderItems]
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 8);

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2));

  console.log(`Wrote ${merged.length} news items to ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error('Failed to fetch news:', err);
  process.exit(1);
});
