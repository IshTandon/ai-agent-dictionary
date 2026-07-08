import { Metadata } from 'next';
import Link from 'next/link';

import { getLatestNews } from '@/lib/news';
import { getRecentTerms } from '@/lib/recent-terms';
import { CATEGORY_COLORS } from '@/lib/categories';
import { Category } from '@/lib/types';
import { getSymbol } from '@/lib/symbols';
import TierBadge from '@/components/TierBadge';

export const metadata: Metadata = {
  title: "What's New | AgentDict",
  description: 'Latest AI agent news and recently added terms — updated daily.',
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#038;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function WhatsNewPage() {
  const news = getLatestNews();
  const recentTerms = getRecentTerms(12);

  return (
    <div className="mx-auto max-w-[720px] px-6 py-12">
      <header className="mb-10">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-[12px] transition-colors"
          style={{ color: 'var(--color-dim)' }}
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>
        <h1 className="gradient-text font-[family-name:var(--font-display)] text-2xl font-[700]">
          What&apos;s New
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          Latest AI agent news and recently added terms. Updated daily via automated pipelines.
        </p>
      </header>

      {/* Recently added terms */}
      <section className="mb-12">
        <div className="mb-5 flex items-center gap-2.5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--color-green)' }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: 'var(--color-green)' }} />
            New terms
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {recentTerms.map(term => {
            const catColor = CATEGORY_COLORS[term.category as Category];
            const symbol = getSymbol(term.term, term.slug);
            return (
              <Link
                key={term.slug}
                href={`/terms/${term.slug}`}
                className="card-lift group flex items-center gap-3"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '12px',
                  border: '0.5px solid var(--color-border)',
                  padding: '14px 16px',
                }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-mono)] text-[12px] font-bold"
                  style={{ backgroundColor: `${catColor}20`, color: catColor }}
                >
                  {symbol}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-[family-name:var(--font-display)] text-[14px] font-[700]" style={{ color: 'var(--color-text)' }}>
                      {term.term}
                    </span>
                    <TierBadge tier={term.tier} />
                  </div>
                  <p className="mt-1 line-clamp-1 text-[12px]" style={{ color: 'var(--color-dim)' }}>
                    {term.definition_plain}
                  </p>
                </div>
                <svg className="ml-2 h-4 w-4 shrink-0" style={{ color: 'var(--color-dim)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI News Feed */}
      {news.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-2.5">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
              style={{ backgroundColor: 'rgba(124,111,255,0.12)', color: 'var(--color-accent)' }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
              AI News Feed
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {news.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-lift group flex items-start gap-3"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '12px',
                  border: '0.5px solid var(--color-border)',
                  padding: '14px 16px',
                }}
              >
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[14px]"
                  style={{ backgroundColor: 'var(--color-card)' }}
                >
                  📰
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium leading-snug" style={{ color: 'var(--color-text)' }}>
                    {decodeHtmlEntities(item.title)}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px]" style={{ color: 'var(--color-dim)' }}>
                    <span>{item.source}</span>
                    <span>·</span>
                    <span>{formatDate(item.published_at)}</span>
                  </div>
                </div>
                <svg className="ml-2 mt-1 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--color-dim)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
