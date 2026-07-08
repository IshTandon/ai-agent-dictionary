import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_DESCRIPTIONS, CATEGORY_COLORS, getCategoryFromSlug } from '@/lib/categories';
import { getTermsByCategory } from '@/lib/terms';
import { Category } from '@/lib/types';
import TierBadge from '@/components/TierBadge';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return Object.values(CATEGORY_SLUGS).map(category => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryFromSlug(slug);
  if (!category) return {};
  return {
    title: `${category} | AgentDict`,
    description: CATEGORY_DESCRIPTIONS[category],
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategoryFromSlug(slug);
  if (!category) notFound();

  const terms = getTermsByCategory(category);
  const catColor = CATEGORY_COLORS[category];
  const categoryIndex = CATEGORIES.indexOf(category);
  const prevCategory = categoryIndex > 0 ? CATEGORIES[categoryIndex - 1] : null;
  const nextCategory = categoryIndex < CATEGORIES.length - 1 ? CATEGORIES[categoryIndex + 1] : null;

  return (
    <div className="mx-auto max-w-[720px] px-6 py-12">
      <header className="mb-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-[12px] transition-colors"
          style={{ color: 'var(--color-dim)' }}
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All categories
        </Link>
        <div className="mb-2 flex items-center gap-3">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: catColor }} />
          <h1
            className="font-[family-name:var(--font-display)] text-3xl font-[700] tracking-tight md:text-5xl"
            style={{ color: catColor }}
          >
            {category}
          </h1>
        </div>
        <p className="text-[13px]" style={{ color: 'var(--color-muted)' }}>
          {CATEGORY_DESCRIPTIONS[category]}
        </p>
        <div
          className="mt-3 inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium"
          style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)', color: 'var(--color-dim)' }}
        >
          {terms.length} terms
        </div>
      </header>

      <div className="flex flex-col gap-1.5">
        {terms
          .sort((a, b) => a.tier - b.tier || a.term.localeCompare(b.term))
          .map(term => (
            <Link
              key={term.slug}
              href={`/terms/${term.slug}`}
              className="card-lift group flex items-center justify-between"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                border: '0.5px solid var(--color-border)',
                padding: '14px 18px',
              }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-display)] text-[14px] font-[700] transition-colors" style={{ color: 'var(--color-text)' }}>
                    {term.term}
                  </span>
                  <TierBadge tier={term.tier} />
                </div>
                <p className="mt-1 line-clamp-1 text-[12px]" style={{ color: 'var(--color-dim)' }}>
                  {term.definition_plain}
                </p>
              </div>
              <svg className="ml-4 h-4 w-4 shrink-0 transition-colors" style={{ color: 'var(--color-dim)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
      </div>

      <nav className="mt-10 flex items-center justify-between pt-6" style={{ borderTop: '0.5px solid var(--color-border)' }}>
        {prevCategory ? (
          <Link
            href={`/categories/${CATEGORY_SLUGS[prevCategory]}`}
            className="flex items-center gap-2 text-[13px] font-medium transition-colors"
            style={{ color: 'var(--color-muted)' }}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[prevCategory as Category] }} />
            {prevCategory}
          </Link>
        ) : <div />}
        {nextCategory ? (
          <Link
            href={`/categories/${CATEGORY_SLUGS[nextCategory]}`}
            className="flex items-center gap-2 text-[13px] font-medium transition-colors"
            style={{ color: 'var(--color-muted)' }}
          >
            {nextCategory}
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[nextCategory as Category] }} />
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : <div />}
      </nav>
    </div>
  );
}
