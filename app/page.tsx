import Link from 'next/link';
import { readFileSync } from 'fs';
import { join } from 'path';

import { getAllTerms } from '@/lib/terms';
import { CATEGORIES, CATEGORY_SLUGS, CATEGORY_DESCRIPTIONS, CATEGORY_COLORS } from '@/lib/categories';
import { Category } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import TierBadge from '@/components/TierBadge';
import ViewToggle from '@/components/ViewToggle';
import DailyTerm from '@/components/DailyTerm';

interface NewsItem {
  title: string;
  url: string;
  source: 'Hacker News' | 'The Decoder';
  published_at: string;
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function getNewsItems(): NewsItem[] {
  try {
    const filePath = join(process.cwd(), 'content', 'news', 'latest.json');
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

const CATEGORY_ICONS: Record<string, string> = {
  Foundation: '\u2B22',
  Memory: '\u29C9',
  Tools: '\u2692',
  Protocols: '\u21C4',
  Retrieval: '\u2315',
  Orchestration: '\u2725',
  Evaluation: '\u2714',
  Security: '\u26E8',
  Observability: '\u25CE',
};

export default function HomePage() {
  const allTerms = getAllTerms();
  const newsItems = getNewsItems();

  const categoryCounts = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = allTerms.filter(t => t.category === cat).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const featuredTerms = allTerms
    .filter(t => t.tier === 1)
    .slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-indigo/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-indigo/20 bg-accent-indigo-dim px-3 py-1 text-[11px] font-medium text-accent-indigo-light">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-indigo animate-pulse" />
              100 terms &middot; Plain English &middot; Quiz-powered
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Agent{' '}
              <span className="text-accent-indigo">Atlas</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary">
              The term you just heard in a meeting, explained so you can use it in the next one.
              Definitions, scenarios, and quizzes — 100 concepts from foundation to frontier.
            </p>
            <div className="mt-8 sm:hidden">
              <SearchBar terms={allTerms} variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Today in AI */}
      {newsItems.length > 0 && (
        <section className="border-b border-border py-12">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-1 font-[family-name:var(--font-display)] text-lg font-semibold text-text-primary">
              Today in AI
            </h2>
            <p className="mb-6 text-sm text-text-muted">
              Latest from Hacker News &amp; The Decoder
            </p>
            <div className="flex gap-3 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0">
              {newsItems.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-lift flex min-w-[260px] flex-col justify-between rounded-xl border border-border bg-surface p-4 sm:min-w-0"
                >
                  <div>
                    <span
                      className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.source === 'Hacker News'
                          ? 'bg-orange-500/15 text-orange-400'
                          : 'bg-blue-500/15 text-blue-400'
                      }`}
                    >
                      {item.source}
                    </span>
                    <p className="text-sm font-medium leading-snug text-text-primary line-clamp-2">
                      {item.title}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-text-muted">
                      {getRelativeTime(item.published_at)}
                    </span>
                    <span className="text-xs text-text-secondary">&rarr;</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-6 py-14">
        <DailyTerm
          terms={allTerms.map(t => ({
            slug: t.slug,
            term: t.term,
            definition_plain: t.definition_plain,
          }))}
        />

        <div className="mb-10 flex items-center justify-between">
          <div />
          <ViewToggle />
        </div>

        {/* Category grid — colored cards */}
        <section className="mb-16">
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-lg font-semibold text-text-primary">
            Browse by category
          </h2>
          <p className="mb-8 text-sm text-text-muted">9 domains covering the full AI agent stack</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map(cat => {
              const color = CATEGORY_COLORS[cat];
              return (
                <Link
                  key={cat}
                  href={`/categories/${CATEGORY_SLUGS[cat]}`}
                  className="card-lift group relative overflow-hidden rounded-xl border border-border bg-surface p-5"
                >
                  {/* Colored top edge */}
                  <div
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{ backgroundColor: color }}
                  />
                  {/* Background glow */}
                  <div
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.07] blur-2xl transition-opacity group-hover:opacity-[0.15]"
                    style={{ backgroundColor: color }}
                  />
                  <div className="relative">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
                        style={{
                          backgroundColor: `${color}15`,
                          color: color,
                        }}
                      >
                        {CATEGORY_ICONS[cat]}
                      </div>
                      <h3
                        className="font-[family-name:var(--font-display)] text-sm font-semibold"
                        style={{ color }}
                      >
                        {cat}
                      </h3>
                    </div>
                    <p className="text-[13px] leading-relaxed text-text-muted">
                      {CATEGORY_DESCRIPTIONS[cat]}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {categoryCounts[cat]} terms
                      </span>
                      <span
                        className="text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ color }}
                      >
                        Explore &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured / Tier 1 terms */}
        <section className="mb-16">
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-lg font-semibold text-text-primary">
            Featured deep dives
          </h2>
          <p className="mb-8 text-sm text-text-muted">Full cards with scenarios, quizzes &amp; real-world examples</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTerms.map(term => {
              const catColor = CATEGORY_COLORS[term.category as Category];
              return (
                <Link
                  key={term.slug}
                  href={`/terms/${term.slug}`}
                  className="card-lift group rounded-xl border border-border bg-surface p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${catColor}15`,
                        color: catColor,
                      }}
                    >
                      {term.category}
                    </span>
                    <TierBadge tier={term.tier} />
                  </div>
                  <h3 className="mb-2 font-[family-name:var(--font-display)] text-sm font-semibold text-text-primary group-hover:text-accent-indigo-light transition-colors">
                    {term.term}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-relaxed text-text-muted">
                    {term.definition_plain}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All terms cloud */}
        <section>
          <h2 className="mb-2 font-[family-name:var(--font-display)] text-lg font-semibold text-text-primary">
            All 100 terms
          </h2>
          <p className="mb-6 text-sm text-text-muted">Click any term to learn it</p>
          <div className="flex flex-wrap gap-2">
            {allTerms
              .sort((a, b) => a.term.localeCompare(b.term))
              .map(term => {
                const catColor = CATEGORY_COLORS[term.category as Category];
                return (
                  <Link
                    key={term.slug}
                    href={`/terms/${term.slug}`}
                    className="rounded-md border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-text-secondary transition-all hover:border-border-bright hover:text-text-primary"
                    style={{ '--hover-color': catColor } as React.CSSProperties}
                  >
                    {term.term}
                  </Link>
                );
              })}
          </div>
        </section>
      </div>
    </>
  );
}
