import Link from 'next/link';

import { Term, Category } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/categories';
import { getSymbol } from '@/lib/symbols';

interface RecentTermsProps {
  terms: Term[];
}

export default function RecentTerms({ terms }: RecentTermsProps) {
  if (terms.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
          style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--color-green)' }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: 'var(--color-green)' }} />
          Recently added
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {terms.slice(0, 6).map(term => {
          const catColor = CATEGORY_COLORS[term.category as Category];
          const symbol = getSymbol(term.term, term.slug);
          return (
            <Link
              key={term.slug}
              href={`/terms/${term.slug}`}
              className="card-lift group flex items-center gap-3"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                border: '0.5px solid var(--color-border)',
                padding: '12px 14px',
              }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-mono)] text-[11px] font-bold"
                style={{ backgroundColor: `${catColor}20`, color: catColor }}
              >
                {symbol}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
                    {term.term}
                  </span>
                  <span
                    className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase"
                    style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--color-green)' }}
                  >
                    New
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-[11px]" style={{ color: 'var(--color-dim)' }}>
                  {term.definition_plain}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
