'use client';

import { useProgress } from '@/lib/progress-context';

export default function XPBar() {
  const { xp, level, xpToNextLevel, streak } = useProgress();
  const pct = Math.min(((100 - xpToNextLevel) / 100) * 100, 100);

  if (xp === 0 && streak === 0) return null;

  return (
    <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
      <div
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
        style={{
          backgroundColor: 'rgba(139,124,255,0.12)',
          border: '1px solid rgba(139,124,255,0.25)',
        }}
      >
        <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold" style={{ color: 'var(--color-accent-soft)' }}>
          Lv {level}
        </span>
        <span className="hidden font-[family-name:var(--font-mono)] text-[10px] tabular-nums sm:inline" style={{ color: 'var(--color-dim)' }}>
          ·
        </span>
        <span className="hidden font-[family-name:var(--font-mono)] text-[10px] tabular-nums sm:inline" style={{ color: 'var(--color-dim)' }}>
          {xp} XP
        </span>
        <div className="hidden h-[3px] w-[40px] overflow-hidden rounded-full sm:block" style={{ backgroundColor: 'var(--color-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: 'var(--color-accent)' }}
          />
        </div>
      </div>
      {streak > 0 && (
        <span className="flex items-center gap-1 whitespace-nowrap text-[11px] font-medium" style={{ color: 'var(--color-amber)' }}>
          🔥 {streak}
        </span>
      )}
    </div>
  );
}
