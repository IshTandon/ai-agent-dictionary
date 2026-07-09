'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { isSessionCompletedToday } from '@/lib/progress';

export default function DailySessionCard() {
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDone(isSessionCompletedToday());
  }, []);

  if (!mounted) return null;

  if (done) {
    return (
      <Link
        href="/session"
        className="card-lift flex items-center justify-between"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '14px',
          border: '0.5px solid var(--color-border)',
          padding: '16px 20px',
        }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-green)' }}>
            ✓ Done today
          </p>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--color-muted)' }}>
            Bonus round for extra XP
          </p>
        </div>
        <span
          className="rounded-lg px-3 py-1.5 text-[12px] font-medium"
          style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)', color: 'var(--color-muted)' }}
        >
          Bonus &rarr;
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/session"
      className="card-lift flex items-center justify-between"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '14px',
        border: '0.5px solid var(--color-border)',
        borderLeft: '3px solid var(--color-accent)',
        padding: '16px 20px',
      }}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-accent-soft)' }}>
          Daily 5
        </p>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--color-muted)' }}>
          Today&apos;s session &middot; ~2 min
        </p>
      </div>
      <span
        className="rounded-lg px-3 py-1.5 text-[12px] font-medium"
        style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}
      >
        Start &rarr;
      </span>
    </Link>
  );
}
