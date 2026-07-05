'use client';

import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';

import { Term } from '@/lib/types';

interface SearchBarProps {
  terms: Term[];
}

export default function SearchBar({ terms }: SearchBarProps) {
  const [query, setQuery] = useState('');

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

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
          placeholder="Search AI terms... e.g. RAG, prompt injection, MCP"
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm shadow-sm transition-shadow placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      {results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
          {results.map(({ item }) => (
            <Link
              key={item.slug}
              href={`/terms/${item.slug}`}
              className="block border-b border-gray-100 px-4 py-3 last:border-0 hover:bg-gray-50"
              onClick={() => setQuery('')}
            >
              <span className="font-medium text-gray-900">{item.term}</span>
              <span className="ml-2 text-xs text-gray-500">{item.category}</span>
              <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                {item.definition_plain}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
