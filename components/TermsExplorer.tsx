'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Term } from '@/lib/types';
import PeriodicTable from './PeriodicTable';

interface CategoryData {
  name: string;
  slug: string;
  description: string;
  color: string;
  count: number;
}

interface TermsExplorerProps {
  categories: CategoryData[];
  terms: Term[];
}

export default function TermsExplorer({ categories, terms }: TermsExplorerProps) {
  const [view, setView] = useState<'browse' | 'table'>('browse');

  return (
    <div>
      <div className="mb-10 flex items-center justify-center gap-1 rounded-lg border border-border bg-surface p-0.5 sm:inline-flex">
        <button
          onClick={() => setView('browse')}
          className={`rounded-md px-4 py-2 text-xs font-medium transition-colors ${
            view === 'browse'
              ? 'bg-accent-indigo text-white'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Browse by category
        </button>
        <button
          onClick={() => setView('table')}
          className={`rounded-md px-4 py-2 text-xs font-medium transition-colors ${
            view === 'table'
              ? 'bg-accent-indigo text-white'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Periodic Table
        </button>
      </div>

      {view === 'browse' ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(cat => (
            <Link
              key={cat.name}
              href={`/categories/${cat.slug}`}
              className="card-lift group relative overflow-hidden rounded-xl border border-border bg-surface p-5"
              style={{ borderLeftColor: cat.color, borderLeftWidth: '3px' }}
            >
              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.06] blur-2xl transition-opacity group-hover:opacity-[0.14]"
                style={{ backgroundColor: cat.color }}
              />
              <div className="relative">
                <h3
                  className="mb-1.5 font-[family-name:var(--font-display)] text-sm font-semibold"
                  style={{ color: cat.color }}
                >
                  {cat.name}
                </h3>
                <p className="mb-3 text-[13px] leading-relaxed text-text-muted">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: `${cat.color}15`,
                      color: cat.color,
                    }}
                  >
                    {cat.count} terms
                  </span>
                  <span
                    className="text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ color: cat.color }}
                  >
                    Explore &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <PeriodicTable terms={terms} />
      )}
    </div>
  );
}
