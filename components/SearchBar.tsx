'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';

import { Term, Category } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/categories';

interface SearchBarProps {
  terms: Term[];
  variant?: 'hero' | 'nav' | 'panic' | 'default';
}

export default function SearchBar({ terms, variant = 'default' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (variant === 'panic' && inputRef.current && window.innerWidth >= 768) {
      inputRef.current.focus();
    }
  }, [variant]);

  const isNav = variant === 'nav';
  const isPanic = variant === 'panic';
  const isHero = variant === 'hero';

  const widthClass = isNav ? 'w-64' : 'w-full';

  if (isPanic) {
    return (
      <div ref={containerRef} className="relative w-full">
        <div
          className="search-ring relative transition-all"
          style={{
            borderRadius: '12px',
            border: '1px solid #2A3054',
          }}
        >
          <svg
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2"
            style={{ color: 'var(--color-dim)' }}
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
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="What did they just say in your meeting?"
            className="w-full focus:outline-none"
            style={{
              backgroundColor: '#141929',
              color: '#F0EDE8',
              padding: '16px 48px 16px 52px',
              fontSize: '15px',
              borderRadius: '12px',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-0.5 transition-colors"
              style={{ color: 'var(--color-dim)' }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {results.length > 0 && isFocused && (
          <div
            className="absolute z-50 mt-2 w-full overflow-hidden shadow-2xl shadow-black/40"
            style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px' }}
          >
            {results.map(({ item }, i) => (
              <Link
                key={item.slug}
                href={`/terms/${item.slug}`}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                style={{ borderBottom: i !== results.length - 1 ? '0.5px solid var(--color-border)' : undefined }}
                onClick={() => { setQuery(''); setIsFocused(false); }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-mono)] text-[10px] font-bold"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[item.category as Category]}20`,
                    color: CATEGORY_COLORS[item.category as Category],
                  }}
                >
                  {item.term.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[14px] font-medium" style={{ color: 'var(--color-text)' }}>{item.term}</span>
                  <p className="mt-0.5 line-clamp-1 text-[12px]" style={{ color: 'var(--color-dim)' }}>
                    {item.definition_plain}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[item.category as Category]}20`,
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

  return (
    <div ref={containerRef} className={`relative ${widthClass}`}>
      <div className="search-ring relative rounded-full transition-all" style={{ border: '0.5px solid var(--color-border)' }}>
        <svg
          className={`pointer-events-none absolute ${isNav ? 'left-3 h-3.5 w-3.5' : 'left-4 h-4 w-4'} top-1/2 -translate-y-1/2`}
          style={{ color: 'var(--color-dim)' }}
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
          placeholder={isNav ? '\u2318 Search...' : 'Search a term you just heard in a meeting...'}
          className="w-full rounded-full focus:outline-none"
          style={{
            backgroundColor: 'var(--color-card)',
            color: 'var(--color-text)',
            padding: isNav ? '7px 12px 7px 34px' : '12px 40px 12px 44px',
            fontSize: isNav ? '12px' : '14px',
            height: isHero ? '48px' : undefined,
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 transition-colors"
            style={{ color: 'var(--color-dim)' }}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {results.length > 0 && isFocused && (
        <div
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
          style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)' }}
        >
          {results.map(({ item }, i) => (
            <Link
              key={item.slug}
              href={`/terms/${item.slug}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors"
              style={{ borderBottom: i !== results.length - 1 ? '0.5px solid var(--color-border)' : undefined }}
              onClick={() => { setQuery(''); setIsFocused(false); }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-mono)] text-[10px] font-bold"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[item.category as Category]}20`,
                  color: CATEGORY_COLORS[item.category as Category],
                }}
              >
                {item.term.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>{item.term}</span>
                <p className="mt-0.5 line-clamp-1 text-[11px]" style={{ color: 'var(--color-dim)' }}>
                  {item.definition_plain}
                </p>
              </div>
              <span
                className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[item.category as Category]}20`,
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
