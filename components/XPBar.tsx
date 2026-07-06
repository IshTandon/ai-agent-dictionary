'use client';

import { useEffect, useState } from 'react';

import { getProgress, getLevel, type UserProgress } from '@/lib/progress';

export default function XPBar() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());

    function onStorage() {
      setProgress(getProgress());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!progress) return null;

  const { level, current, needed } = getLevel(progress.xp);
  const pct = Math.min((current / needed) * 100, 100);

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
          {progress.xp} XP
        </span>
      </div>
      {progress.streak > 0 && (
        <span className="text-[11px] font-medium" style={{ color: 'var(--color-amber)' }}>
          🔥 {progress.streak}
        </span>
      )}
    </div>
  );
}
