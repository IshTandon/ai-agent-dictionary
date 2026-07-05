'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';

import { Term } from '@/lib/types';

interface SearchBarProps {
  terms: Term[];
  variant?: 'hero' | 'default';
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

  const results = query.length > 1 ? fuse.search(query).slice(0, 8) : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className={`relative w-full ${isHero ? 'max-w-lg' : 'max-w-xl'}`}>
      <div className={`search-glow relative rounded-2xl transition-all ${isHero ? 'shadow-lg shadow-indigo-500/10' : ''}`}>
        <svg
          className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isHero ? 'text-gray-400' : 'text-gray-400'}`}
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
          placeholder="Search terms... e.g. RAG, prompt injection, MCP"
          className={`w-full rounded-2xl border bg-white py-3.5 pl-11 pr-4 text-sm transition-all placeholder:text-gray-400 focus:outline-none ${
            isHero
              ? 'border-gray-200/80 shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100'
              : 'border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50'
          }`}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {results.length > 0 && isFocused && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50">
          {results.map(({ item }, i) => (
            <Link
              key={item.slug}
              href={`/terms/${item.slug}`}
              className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50 ${i !== results.length - 1 ? 'border-b border-gray-100' : ''}`}
              onClick={() => { setQuery(''); setIsFocused(false); }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-500">
                {item.term.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{item.term}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                    {item.category}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                  {item.definition_plain}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
