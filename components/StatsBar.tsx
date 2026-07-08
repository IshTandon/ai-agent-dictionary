'use client';

import { useEffect, useState } from 'react';

interface StatsBarProps {
  totalTerms: number;
  totalCategories: number;
  tier1Count: number;
  tier2Count: number;
}

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return <>{current}</>;
}

export default function StatsBar({ totalTerms, totalCategories, tier1Count, tier2Count }: StatsBarProps) {
  const stats = [
    { label: 'Terms', value: totalTerms, color: 'var(--color-accent)' },
    { label: 'Categories', value: totalCategories, color: 'var(--color-accent-soft)' },
    { label: 'Deep dives', value: tier1Count, color: 'var(--color-amber)' },
    { label: 'With quizzes', value: tier2Count, color: 'var(--color-green)' },
  ];

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
      {stats.map(s => (
        <div key={s.label} className="flex items-center gap-2">
          <span
            className="font-[family-name:var(--font-mono)] text-[20px] font-bold tabular-nums"
            style={{ color: s.color }}
          >
            <AnimatedNumber target={s.value} />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-dim)' }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
