import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_DESCRIPTIONS, getCategoryFromSlug } from '@/lib/categories';
import { getTermsByCategory } from '@/lib/terms';
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
  const categoryIndex = CATEGORIES.indexOf(category);
  const prevCategory = categoryIndex > 0 ? CATEGORIES[categoryIndex - 1] : null;
  const nextCategory = categoryIndex < CATEGORIES.length - 1 ? CATEGORIES[categoryIndex + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <header className="mb-10">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All categories
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{category}</h1>
        <p className="mt-2 text-base text-gray-500">{CATEGORY_DESCRIPTIONS[category]}</p>
        <div className="mt-3 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          {terms.length} terms
        </div>
      </header>

      <div className="space-y-2.5">
        {terms
          .sort((a, b) => a.tier - b.tier || a.term.localeCompare(b.term))
          .map(term => (
            <Link
              key={term.slug}
              href={`/terms/${term.slug}`}
              className="card-hover group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-6 py-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {term.term}
                  </span>
                  <TierBadge tier={term.tier} />
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                  {term.definition_plain}
                </p>
              </div>
              <svg className="ml-4 h-4 w-4 shrink-0 text-gray-300 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
      </div>

      <nav className="mt-12 flex items-center justify-between border-t border-gray-200/60 pt-8">
        {prevCategory ? (
          <Link
            href={`/categories/${CATEGORY_SLUGS[prevCategory]}`}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {prevCategory}
          </Link>
        ) : <div />}
        {nextCategory ? (
          <Link
            href={`/categories/${CATEGORY_SLUGS[nextCategory]}`}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-700 transition-colors"
          >
            {nextCategory}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : <div />}
      </nav>
    </div>
  );
}
