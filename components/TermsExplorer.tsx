'use client';

import Link from 'next/link';

interface CategoryData {
  name: string;
  slug: string;
  description: string;
  color: string;
  count: number;
}

interface TermsExplorerProps {
  categories: CategoryData[];
}

export default function TermsExplorer({ categories }: TermsExplorerProps) {
  return (
    <div>
      <div className="mb-8 flex items-center gap-2">
        <span
          className="rounded-lg px-3.5 py-1.5 text-[12px] font-medium"
          style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
        >
          Browse by category
        </span>
        <Link
          href="/table"
          className="rounded-lg px-3.5 py-1.5 text-[12px] font-medium transition-colors"
          style={{ color: 'var(--color-dim)' }}
        >
          Periodic Table
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(cat => (
          <Link
            key={cat.name}
            href={`/categories/${cat.slug}`}
            className="card-lift group relative"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '0.5px solid var(--color-border)',
              borderRadius: '14px',
              borderLeft: `3px solid ${cat.color}`,
              padding: '16px 18px',
            }}
          >
            <h3
              className="mb-1.5 font-[family-name:var(--font-display)] text-[15px] font-[700]"
              style={{ color: 'var(--color-text)' }}
            >
              {cat.name}
            </h3>
            <p className="mb-3 text-[12px] leading-[1.5]" style={{ color: 'var(--color-muted)' }}>
              {cat.description}
            </p>
            <div className="flex items-center justify-end">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  backgroundColor: `${cat.color}25`,
                  color: cat.color,
                }}
              >
                {cat.count} terms
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
