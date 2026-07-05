import Link from 'next/link';

import { getAllTerms } from '@/lib/terms';
import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_DESCRIPTIONS } from '@/lib/categories';
import SearchBar from '@/components/SearchBar';
import TierBadge from '@/components/TierBadge';

const CATEGORY_ICONS: Record<string, string> = {
  Foundation: '&#x2B22;',
  Memory: '&#x29C9;',
  Tools: '&#x2692;',
  Protocols: '&#x21C4;',
  Retrieval: '&#x2315;',
  Orchestration: '&#x2725;',
  Evaluation: '&#x2714;',
  Security: '&#x26E8;',
  Observability: '&#x25CE;',
};

export default function HomePage() {
  const allTerms = getAllTerms();

  const categoryCounts = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = allTerms.filter(t => t.category === cat).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const featuredTerms = allTerms
    .filter(t => t.tier === 1)
    .slice(0, 4);

  return (
    <>
      <section className="hero-gradient relative overflow-hidden">
        <div className="hero-glow absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              100 terms &middot; Plain English &middot; Quiz-powered
            </div>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Master the language of{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Agents
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-gray-400">
              The term you just heard in a meeting, explained so you can use it in the next one.
              Definitions, scenarios, and quizzes for every concept.
            </p>
            <div className="mt-10 flex justify-center">
              <SearchBar terms={allTerms} variant="hero" />
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </section>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured terms</h2>
              <p className="mt-1 text-sm text-gray-500">Deep-dive cards with scenarios, quizzes &amp; real-world examples</p>
            </div>
            <Link href="/categories/foundation" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredTerms.map((term, i) => (
              <Link
                key={term.slug}
                href={`/terms/${term.slug}`}
                className="card-hover group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {term.category}
                  </span>
                  <TierBadge tier={term.tier} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                  {term.term}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                  {term.definition_plain}
                </p>
                <div className="mt-4 flex items-center text-xs font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Read full card &rarr;
                </div>
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-50 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Browse by category</h2>
            <p className="mt-1 text-sm text-gray-500">9 domains covering the full AI agent stack</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                href={`/categories/${CATEGORY_SLUGS[cat]}`}
                className="card-hover group relative rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-lg text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"
                    dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[cat] || '&#x2022;' }}
                  />
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {cat}
                  </h3>
                </div>
                <p className="text-[13px] leading-relaxed text-gray-500">
                  {CATEGORY_DESCRIPTIONS[cat]}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">
                    {categoryCounts[cat]} terms
                  </span>
                  <span className="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">All 100 terms</h2>
            <p className="mt-1 text-sm text-gray-500">Click any term to learn it</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTerms
              .sort((a, b) => a.term.localeCompare(b.term))
              .map(term => (
                <Link
                  key={term.slug}
                  href={`/terms/${term.slug}`}
                  className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-gray-600 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow"
                >
                  {term.term}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
