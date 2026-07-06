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
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="mx-auto max-w-[720px]">
          <h1 className="gradient-text font-[family-name:var(--font-display)] text-[40px] font-[800] leading-[1.1]">
            The AI Agent Dictionary
          </h1>
          <p className="mx-auto mt-4 text-[16px]" style={{ color: 'var(--color-muted)' }}>
            Every term. Plain English. No fluff.
          </p>
          <div className="mx-auto mt-8 max-w-[480px]">
            <SearchBar terms={allTerms} variant="hero" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[720px] px-6 pb-14">
        <DailyTerm
          terms={allTerms.map(t => ({
            slug: t.slug,
            term: t.term,
            definition_plain: t.definition_plain,
          }))}
        />

        <TermsExplorer categories={categoriesData} />
      </div>
    </>
  );
}
