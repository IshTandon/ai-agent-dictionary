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

const CONSONANTS = /[bcdfghjklmnpqrstvwxyz]/gi;

function getSymbol(name: string): string {
  if (name.length <= 3 && name === name.toUpperCase()) return name;
  const consonants = name.match(CONSONANTS);
  if (consonants && consonants.length >= 3) {
    return consonants.slice(0, 3).join('').toUpperCase();
  }
  return name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
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

  const symbol = getSymbol(dailyTermData.term);
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
        <div className="flex items-center gap-5">
          <span className="font-[family-name:var(--font-display)] text-4xl font-bold leading-none tracking-tight text-accent-amber/70 sm:text-5xl">
            {symbol}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              {dailyTermData.term}
            </h3>
            <p className="max-w-lg text-sm leading-relaxed text-text-secondary">
              {firstSentence}
            </p>
          </div>
        </div>
        {!alreadyViewed && (
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-accent-amber-dim px-2.5 py-1 text-xs font-semibold text-accent-amber">
            +25 XP bonus
          </span>
        )}
      </Link>
    </section>
  );
}
