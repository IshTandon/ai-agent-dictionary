'use client';

import { useState, useEffect, useCallback } from 'react';

interface NewsItem {
  title: string;
  url: string;
  source: string;
  published_at: string;
}

interface NewsTickerProps {
  items: NewsItem[];
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#038;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

export default function NewsTicker({ items }: NewsTickerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const advance = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const timer = setInterval(advance, 5000);
    return () => clearInterval(timer);
  }, [advance, isPaused, items.length]);

  if (items.length === 0) return null;

  const item = items[activeIndex];

  return (
    <div
      className="news-ticker"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-2">
        <span className="news-pulse shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          Live
        </span>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="news-link min-w-0 flex-1 truncate text-[12px] font-medium"
        >
          {decodeHtmlEntities(item.title)}
        </a>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-[10px] sm:inline" style={{ color: 'var(--color-dim)' }}>
            {item.source} · {timeAgo(item.published_at)}
          </span>

          <div className="flex items-center gap-1">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? '12px' : '4px',
                  backgroundColor: i === activeIndex ? 'var(--color-accent)' : 'var(--color-border)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
