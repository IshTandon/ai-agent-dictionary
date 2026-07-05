'use client';

import { useEffect, useState } from 'react';

import { getProgress, getLevel, type UserProgress } from '@/lib/progress';

export default function XPBar() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());

    const handleStorage = () => setProgress(getProgress());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!progress) return null;

  const { level, current, needed } = getLevel(progress.xp);
  const pct = Math.min((current / needed) * 100, 100);

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-indigo text-[10px] font-bold text-white">
        {level}
      </div>
      <div className="hidden w-20 sm:block">
        <div className="h-1.5 rounded-full bg-void-lighter">
          <div
            className="h-full rounded-full bg-accent-indigo transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-0.5 text-[9px] tabular-nums text-text-muted">
          {current}/{needed} XP
        </p>
      </div>
      {progress.streak > 0 && (
        <span className="text-[11px] tabular-nums text-text-secondary">
          🔥{progress.streak}
        </span>
      )}
    </div>
  );
}
