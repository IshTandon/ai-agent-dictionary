'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { getDailyTerm, getProgress, saveProgress, type UserProgress } from '@/lib/progress';

interface SerializedTerm {
  slug: string;
  term: string;
  definition_plain: string;
}

interface DailyTermProps {
  terms: SerializedTerm[];
}

export default function DailyTerm({ terms }: DailyTermProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const allSlugs = terms.map(t => t.slug);
  const dailySlug = getDailyTerm(allSlugs);
  const dailyTermData = terms.find(t => t.slug === dailySlug);

  if (!dailyTermData) return null;

  const firstSentence = dailyTermData.definition_plain.split('. ')[0] + '.';
  const today = new Date().toISOString().slice(0, 10);
  const alreadyViewed = progress?.daily_term_viewed === today;

  function handleClick() {
    if (!progress || alreadyViewed) return;
    const updated = { ...progress, daily_term_viewed: today };
    saveProgress(updated);
    setProgress(updated);
  }

  return (
    <section className="mb-14">
      <Link
        href={`/terms/${dailySlug}`}
        onClick={handleClick}
        className="card-lift block rounded-xl border border-accent-amber/20 bg-surface p-6 sm:p-8"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent-amber-dim px-3 py-1 text-[11px] font-semibold text-accent-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-amber" />
          Today&apos;s term
        </div>
        <h3 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {dailyTermData.term}
        </h3>
        <p className="mb-4 max-w-lg text-sm leading-relaxed text-text-secondary">
          {firstSentence}
        </p>
        {!alreadyViewed && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-amber-dim px-2.5 py-1 text-xs font-semibold text-accent-amber">
            +25 XP bonus
          </span>
        )}
      </Link>
    </section>
  );
}
