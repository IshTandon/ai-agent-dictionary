'use client';

import { useProgress } from '@/lib/progress-context';

export default function XPBar() {
  const { xp, level, levelCurrent, levelNeeded, streak } = useProgress();
  const pct = Math.min((levelCurrent / levelNeeded) * 100, 100);

  if (xp === 0 && streak === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-2 rounded-full px-3 py-1"
        style={{
          backgroundColor: 'rgba(124,111,255,0.12)',
          border: '1px solid rgba(124,111,255,0.3)',
        }}
      >
        <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold" style={{ color: 'var(--color-accent-soft)' }}>
          Lv {level}
        </span>
        <div className="h-[3px] w-[50px] overflow-hidden rounded-full" style={{ backgroundColor: 'var(--color-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: 'var(--color-accent)' }}
          />
        </div>
        <span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums" style={{ color: 'var(--color-dim)' }}>
          {xp} XP
        </span>
      </div>
      {streak > 0 && (
        <span className="text-[11px] font-medium" style={{ color: 'var(--color-amber)' }}>
          🔥 {streak}
        </span>
      )}
    </div>
  );
}
