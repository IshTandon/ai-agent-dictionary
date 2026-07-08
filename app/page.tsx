import Link from 'next/link';

import { getAllTerms, getTermBySlug } from '@/lib/terms';
import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_DESCRIPTIONS, CATEGORY_COLORS } from '@/lib/categories';
import { Category } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import DailyTerm from '@/components/DailyTerm';
import TermsExplorer from '@/components/TermsExplorer';
import ContinueLearning from '@/components/ContinueLearning';

const TRENDING = ['rag', 'agentic-loop', 'guardrail', 'multi-agent', 'thinking-models'];

export default function HomePage() {
  const allTerms = getAllTerms();

  const trendingTerms = TRENDING
    .map(slug => {
      const term = getTermBySlug(slug);
      return term ? { slug, name: term.term } : null;
    })
    .filter((t): t is { slug: string; name: string } => t !== null);

  const categoriesData = CATEGORIES.map(cat => ({
    name: cat,
    slug: CATEGORY_SLUGS[cat],
    description: CATEGORY_DESCRIPTIONS[cat],
    color: CATEGORY_COLORS[cat],
    count: allTerms.filter(t => t.category === cat).length,
  }));

  const categoriesForProgress = CATEGORIES.map(cat => ({
    name: cat,
    slug: CATEGORY_SLUGS[cat],
    color: CATEGORY_COLORS[cat],
    termSlugs: allTerms.filter(t => t.category === cat).map(t => t.slug),
  }));

  return (
    <div className="mx-auto max-w-2xl px-6 pb-14">
      {/* 1. Hero search */}
      <section className="pt-12 pb-4">
        <SearchBar terms={allTerms} variant="panic" />
        <p className="mt-3 text-center text-[13px]" style={{ color: 'var(--color-dim)' }}>
          {allTerms.length} AI terms &middot; plain-English definitions
        </p>
      </section>

      {/* 2. Trending strip */}
      <section className="pb-8">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="shrink-0 text-[12px] font-medium" style={{ color: 'var(--color-dim)' }}>
            🔥 Hot this week
          </span>
          {trendingTerms.map(t => (
            <Link
              key={t.slug}
              href={`/terms/${t.slug}`}
              className="trending-pill shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: '#1C2340',
                border: '1px solid #2A3054',
                color: 'var(--color-muted)',
              }}
            >
              {t.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Continue Learning */}
      <section className="pb-6">
        <ContinueLearning categories={categoriesForProgress} />
      </section>

      {/* 4. Daily term (compact) */}
      <section className="pb-8">
        <DailyTerm
          terms={allTerms.map(t => ({
            slug: t.slug,
            term: t.term,
            definition_plain: t.definition_plain,
          }))}
        />
      </section>

      {/* 5. Category grid */}
      <TermsExplorer categories={categoriesData} />
    </div>
  );
}
