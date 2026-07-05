'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';

import { Term } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/categories';
import { Category } from '@/lib/types';

interface SearchBarProps {
  terms: Term[];
  variant?: 'hero' | 'nav' | 'default';
}

export default function SearchBar({ terms, variant = 'default' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(terms, {
        keys: ['term', 'definition_plain', 'category'],
        threshold: 0.3,
        includeScore: true,
      }),
    [terms]
  );

  const results = query.length > 1 ? fuse.search(query).slice(0, 6) : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isNav = variant === 'nav';
  const isHero = variant === 'hero';

  const widthClass = isNav ? 'w-72' : isHero ? 'w-full max-w-lg' : 'w-full max-w-xl';
  const inputClass = isNav
    ? 'w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50'
    : 'w-full rounded-xl border border-border-bright bg-surface py-3.5 pl-11 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none';

  return (
    <div ref={containerRef} className={`relative ${widthClass}`}>
      <div className={`search-ring relative rounded-${isNav ? 'lg' : 'xl'} transition-all`}>
        <svg
          className={`pointer-events-none absolute ${isNav ? 'left-3 h-3.5 w-3.5' : 'left-4 h-4 w-4'} top-1/2 -translate-y-1/2 text-text-muted`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={isNav ? 'Search terms...' : 'Search all AI agent terms...'}
          className={inputClass}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-text-muted hover:text-text-secondary"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {results.length > 0 && isFocused && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border-bright bg-surface-elevated shadow-2xl shadow-black/40">
          {results.map(({ item }, i) => (
            <Link
              key={item.slug}
              href={`/terms/${item.slug}`}
              className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-void-lighter ${i !== results.length - 1 ? 'border-b border-border' : ''}`}
              onClick={() => { setQuery(''); setIsFocused(false); }}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-[family-name:var(--font-display)] text-[10px] font-bold"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[item.category as Category]}15`,
                  color: CATEGORY_COLORS[item.category as Category],
                }}
              >
                {item.term.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{item.term}</span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-text-muted">
                  {item.definition_plain}
                </p>
              </div>
              <span
                className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[item.category as Category]}15`,
                  color: CATEGORY_COLORS[item.category as Category],
                }}
              >
                {item.category}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
