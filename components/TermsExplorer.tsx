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
      <div className="mb-10 flex items-center justify-center gap-1 rounded-lg border border-border bg-surface p-0.5 sm:inline-flex">
        <span className="rounded-md bg-accent-indigo px-4 py-2 text-xs font-medium text-white">
          Browse by category
        </span>
        <Link
          href="/table"
          className="rounded-md px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          Periodic Table
        </Link>
      </div>

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
    </div>
  );
}
