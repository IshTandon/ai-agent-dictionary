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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{category}</h1>
        <p className="mt-2 text-lg text-gray-600">{CATEGORY_DESCRIPTIONS[category]}</p>
        <p className="mt-1 text-sm text-gray-500">{terms.length} terms</p>
      </header>
      <div className="space-y-3">
        {terms
          .sort((a, b) => a.tier - b.tier || a.term.localeCompare(b.term))
          .map(term => (
            <Link
              key={term.slug}
              href={`/terms/${term.slug}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-5 py-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
            >
              <div>
                <span className="font-medium text-gray-900">{term.term}</span>
                <p className="mt-0.5 line-clamp-1 text-sm text-gray-500">
                  {term.definition_plain}
                </p>
              </div>
              <TierBadge tier={term.tier} />
            </Link>
          ))}
      </div>
    </div>
  );
}
