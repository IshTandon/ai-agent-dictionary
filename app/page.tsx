import Link from 'next/link';

import { getAllTerms } from '@/lib/terms';
import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_DESCRIPTIONS } from '@/lib/categories';
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  const allTerms = getAllTerms();

  const categoryCounts = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = allTerms.filter(t => t.category === cat).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          AI Agent Dictionary
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
          100 terms you need to know to work with AI agents. Plain English definitions, real-world
          scenarios, and quizzes to test your understanding.
        </p>
        <div className="mt-8 flex justify-center">
          <SearchBar terms={allTerms} />
        </div>
      </header>

      <section>
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Browse by category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={`/categories/${CATEGORY_SLUGS[cat]}`}
              className="group rounded-xl border border-gray-200 p-5 transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">{cat}</h3>
              <p className="mt-1 text-sm text-gray-500">{CATEGORY_DESCRIPTIONS[cat]}</p>
              <p className="mt-3 text-xs font-medium text-indigo-600">
                {categoryCounts[cat]} terms &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">All terms</h2>
        <div className="flex flex-wrap gap-2">
          {allTerms
            .sort((a, b) => a.term.localeCompare(b.term))
            .map(term => (
              <Link
                key={term.slug}
                href={`/terms/${term.slug}`}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {term.term}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
