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
    <div className="flex items-center gap-2.5">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-indigo text-[10px] font-bold text-white">
        {level}
      </div>
      <div className="flex w-20 flex-col gap-0.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-void-lighter">
          <div
            className="h-full rounded-full bg-accent-indigo transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[9px] tabular-nums text-text-muted">
          {current}/{needed} XP
        </span>
      </div>
      {progress.streak > 0 && (
        <span className="flex items-center gap-0.5 text-[11px] font-medium text-accent-amber">
          🔥 {progress.streak}
        </span>
      )}
    </div>
  );
}
