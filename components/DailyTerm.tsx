'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { getDailyTerm, getProgress, saveProgress } from '@/lib/progress';
import { useProgress } from '@/lib/progress-context';

interface SerializedTerm {
  slug: string;
  term: string;
  definition_plain: string;
}

interface DailyTermProps {
  terms: SerializedTerm[];
}

const VOWELS_SET = new Set(['a', 'e', 'i', 'o', 'u']);

function getSymbol(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length <= 5 && trimmed === trimmed.toUpperCase() && /^[A-Z0-9]+$/.test(trimmed)) {
    return trimmed.slice(0, 3);
  }
  const consonants: string[] = [];
  for (const ch of trimmed) {
    const lower = ch.toLowerCase();
    if (lower >= 'a' && lower <= 'z' && !VOWELS_SET.has(lower)) {
      consonants.push(ch.toUpperCase());
      if (consonants.length === 3) break;
    }
  }
  return consonants.join('').padEnd(3, 'X').slice(0, 3);
}

export default function DailyTerm({ terms }: DailyTermProps) {
  const { dailyTermViewed, triggerUpdate } = useProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allSlugs = terms.map(t => t.slug);
  const dailySlug = getDailyTerm(allSlugs);
  const dailyTermData = terms.find(t => t.slug === dailySlug);

  if (!dailyTermData) return null;

  const symbol = getSymbol(dailyTermData.term);
  const firstSentence = dailyTermData.definition_plain.split('. ')[0] + '.';
  const today = new Date().toISOString().slice(0, 10);
  const alreadyViewed = mounted && dailyTermViewed === today;

  function handleClick() {
    if (alreadyViewed) return;
    const p = getProgress();
    saveProgress({ ...p, daily_term_viewed: today });
    triggerUpdate();
  }

  return (
    <section className="mb-12">
      <Link
        href={`/terms/${dailySlug}`}
        onClick={handleClick}
        className="card-lift block"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '14px',
          border: '0.5px solid var(--color-border)',
          borderLeft: '3px solid var(--color-amber)',
          padding: '20px 24px',
        }}
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
          style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: 'var(--color-amber)' }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-amber)' }} />
          Today&apos;s term
        </div>
        <div className="flex items-center gap-4">
          <span
            className="shrink-0 font-[family-name:var(--font-mono)] text-[36px] font-bold leading-none"
            style={{ color: 'var(--color-amber)', opacity: 0.6 }}
          >
            {symbol}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 font-[family-name:var(--font-display)] text-lg font-[700]" style={{ color: 'var(--color-text)' }}>
              {dailyTermData.term}
            </h3>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              {firstSentence}
            </p>
          </div>
        </div>
        {!alreadyViewed && (
          <span
            className="mt-3 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold"
            style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: 'var(--color-amber)' }}
          >
            +25 XP bonus
          </span>
        )}
      </Link>
    </section>
  );
}
