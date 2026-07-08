'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { getProgress } from '@/lib/progress';

interface CategoryInfo {
  name: string;
  slug: string;
  color: string;
  termSlugs: string[];
}

interface ContinueLearningProps {
  categories: CategoryInfo[];
}

export default function ContinueLearning({ categories }: ContinueLearningProps) {
  const [mounted, setMounted] = useState(false);
  const [best, setBest] = useState<{
    name: string;
    slug: string;
    color: string;
    viewed: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);

    const p = getProgress();
    const viewedSet = new Set(p.viewed_terms);

    let topCategory: typeof best = null;
    let topViewedCount = -1;

    for (const cat of categories) {
      const viewed = cat.termSlugs.filter(s => viewedSet.has(s)).length;
      if (viewed >= cat.termSlugs.length) continue;
      if (viewed > topViewedCount) {
        topViewedCount = viewed;
        topCategory = {
          name: cat.name,
          slug: cat.slug,
          color: cat.color,
          viewed,
          total: cat.termSlugs.length,
        };
      }
    }

    setBest(topCategory);
  }, [categories]);

  if (!mounted) return null;

  const fallback = categories[0];

  if (!best) {
    return (
      <Link
        href={`/categories/${fallback.slug}`}
        className="card-lift block"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '14px',
          border: '0.5px solid var(--color-border)',
          padding: '18px 20px',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
              Start learning
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-[15px] font-[700]" style={{ color: 'var(--color-text)' }}>
              {fallback.name}
            </p>
          </div>
          <span
            className="rounded-lg px-3 py-1.5 text-[12px] font-medium"
            style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
          >
            Start &rarr;
          </span>
        </div>
      </Link>
    );
  }

  const pct = Math.round((best.viewed / best.total) * 100);

  return (
    <Link
      href={`/categories/${best.slug}`}
      className="card-lift block"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '14px',
        border: '0.5px solid var(--color-border)',
        padding: '18px 20px',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
            Continue learning
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-[15px] font-[700]" style={{ color: 'var(--color-text)' }}>
            {best.name}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-[6px] flex-1 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--color-border)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: 'var(--color-accent)' }}
              />
            </div>
            <span className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: 'var(--color-dim)' }}>
              {best.viewed}/{best.total} terms
            </span>
          </div>
        </div>
        <span
          className="ml-4 shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium"
          style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
        >
          Continue &rarr;
        </span>
      </div>
    </Link>
  );
}
