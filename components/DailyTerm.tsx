'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { getDailyTerm, getProgress, saveProgress } from '@/lib/progress';
import { getSymbol } from '@/lib/symbols';

interface SerializedTerm {
  slug: string;
  term: string;
  definition_plain: string;
}

interface DailyTermProps {
  terms: SerializedTerm[];
}

export default function DailyTerm({ terms }: DailyTermProps) {
  const [dailyViewed, setDailyViewed] = useState(false);

  useEffect(() => {
    const p = getProgress();
    const today = new Date().toISOString().slice(0, 10);
    setDailyViewed(p.daily_term_viewed === today);
  }, []);

  const allSlugs = terms.map(t => t.slug);
  const dailySlug = getDailyTerm(allSlugs);
  const dailyTermData = terms.find(t => t.slug === dailySlug);

  if (!dailyTermData) return null;

  const symbol = getSymbol(dailyTermData.term, dailyTermData.slug);
  const firstSentence = dailyTermData.definition_plain.split('. ')[0] + '.';

  function handleClick() {
    if (dailyViewed) return;
    const today = new Date().toISOString().slice(0, 10);
    const p = getProgress();
    saveProgress({ ...p, daily_term_viewed: today });
    setDailyViewed(true);
  }

  return (
    <Link
      href={`/terms/${dailySlug}`}
      onClick={handleClick}
      className="card-lift block"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '12px',
        border: '0.5px solid var(--color-border)',
        borderLeft: '3px solid var(--color-amber)',
        padding: '14px 16px',
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="shrink-0 font-[family-name:var(--font-mono)] text-[24px] font-bold leading-none"
          style={{ color: 'var(--color-amber)', opacity: 0.5 }}
        >
          {symbol}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em]"
              style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: 'var(--color-amber)' }}
            >
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: 'var(--color-amber)' }} />
              Today
            </span>
            <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
              {dailyTermData.term}
            </span>
            {!dailyViewed && (
              <span
                className="rounded px-1.5 py-0.5 text-[9px] font-bold tabular-nums"
                style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: 'var(--color-amber)' }}
              >
                +25 XP
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-1 text-[12px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            {firstSentence}
          </p>
        </div>
        <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--color-dim)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
