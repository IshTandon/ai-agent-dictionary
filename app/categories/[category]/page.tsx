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
    title: `${category} | AI Agent Dictionary`,
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
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <header className="mb-10">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All categories
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: catColor }}
          />
          <h1
            className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: catColor }}
          >
            {category}
          </h1>
        </div>
        <p className="text-sm text-text-muted">{CATEGORY_DESCRIPTIONS[category]}</p>
        <div className="mt-3 inline-flex items-center rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-text-muted">
          {terms.length} terms
        </div>
      </header>

      <div className="space-y-2">
        {terms
          .sort((a, b) => a.tier - b.tier || a.term.localeCompare(b.term))
          .map(term => (
            <Link
              key={term.slug}
              href={`/terms/${term.slug}`}
              className="card-lift group flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-text-primary group-hover:text-accent-indigo-light transition-colors">
                    {term.term}
                  </span>
                  <TierBadge tier={term.tier} />
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-text-muted">
                  {term.definition_plain}
                </p>
              </div>
              <svg className="ml-4 h-4 w-4 shrink-0 text-text-muted group-hover:text-accent-indigo-light transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
      </div>

      <nav className="mt-12 flex items-center justify-between border-t border-border pt-8">
        {prevCategory ? (
          <Link
            href={`/categories/${CATEGORY_SLUGS[prevCategory]}`}
            className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: CATEGORY_COLORS[prevCategory as Category] }}
            />
            {prevCategory}
          </Link>
        ) : <div />}
        {nextCategory ? (
          <Link
            href={`/categories/${CATEGORY_SLUGS[nextCategory]}`}
            className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            {nextCategory}
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: CATEGORY_COLORS[nextCategory as Category] }}
            />
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : <div />}
      </nav>
    </div>
  );
}
