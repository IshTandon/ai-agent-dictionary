import { getAllTerms } from '@/lib/terms';
import { getLatestNews } from '@/lib/news';
import { getRecentTerms } from '@/lib/recent-terms';
import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_DESCRIPTIONS, CATEGORY_COLORS } from '@/lib/categories';
import SearchBar from '@/components/SearchBar';
import DailyTerm from '@/components/DailyTerm';
import TermsExplorer from '@/components/TermsExplorer';
import NewsTicker from '@/components/NewsTicker';
import RecentTerms from '@/components/RecentTerms';
import StatsBar from '@/components/StatsBar';

export default function HomePage() {
  const allTerms = getAllTerms();
  const news = getLatestNews();
  const recentTerms = getRecentTerms(6);

  const categoriesData = CATEGORIES.map(cat => ({
    name: cat,
    slug: CATEGORY_SLUGS[cat],
    description: CATEGORY_DESCRIPTIONS[cat],
    color: CATEGORY_COLORS[cat],
    count: allTerms.filter(t => t.category === cat).length,
  }));

  const tier1Count = allTerms.filter(t => t.tier === 1).length;
  const tier2Count = allTerms.filter(t => t.tier <= 2).length;

  return (
    <>
      {/* News ticker */}
      {news.length > 0 && <NewsTicker items={news} />}

      {/* Hero */}
      <section style={{ padding: '48px 24px 32px', textAlign: 'center' }}>
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
          <StatsBar
            totalTerms={allTerms.length}
            totalCategories={CATEGORIES.length}
            tier1Count={tier1Count}
            tier2Count={tier2Count}
          />
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

        <RecentTerms terms={recentTerms} />

        <TermsExplorer categories={categoriesData} />
      </div>
    </>
  );
}
