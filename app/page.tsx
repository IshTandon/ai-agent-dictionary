import { getAllTerms } from '@/lib/terms';
import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_DESCRIPTIONS, CATEGORY_COLORS } from '@/lib/categories';
import SearchBar from '@/components/SearchBar';
import DailyTerm from '@/components/DailyTerm';
import TermsExplorer from '@/components/TermsExplorer';

export default function HomePage() {
  const allTerms = getAllTerms();

  const categoriesData = CATEGORIES.map(cat => ({
    name: cat,
    slug: CATEGORY_SLUGS[cat],
    description: CATEGORY_DESCRIPTIONS[cat],
    color: CATEGORY_COLORS[cat],
    count: allTerms.filter(t => t.category === cat).length,
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-indigo/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Agent<span className="text-accent-indigo">Dict</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-text-secondary">
              Every AI agent term, explained in plain English. Updated daily.
            </p>
            <div className="mx-auto mt-8 w-full max-w-[480px]">
              <SearchBar terms={allTerms} variant="hero" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Daily Term */}
        <DailyTerm
          terms={allTerms.map(t => ({
            slug: t.slug,
            term: t.term,
            definition_plain: t.definition_plain,
          }))}
        />

        {/* Browse / Periodic Table toggle + content */}
        <TermsExplorer categories={categoriesData} />
      </div>
    </>
  );
}
