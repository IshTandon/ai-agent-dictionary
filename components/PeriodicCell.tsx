'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface PeriodicCellProps {
  index: number;
  symbol: string;
  term: string;
  slug: string;
  category: string;
  color: string;
  tooltip: string;
}

export default function PeriodicCell({
  index,
  symbol,
  term,
  slug,
  category,
  color,
  tooltip,
}: PeriodicCellProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowTooltip(true), 300);
  }

  function handleLeave() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href={`/terms/${slug}`}
        className="element-cell group relative flex h-[120px] w-[100px] flex-col items-center justify-center rounded-lg border border-border bg-surface transition-transform duration-150 hover:scale-105 hover:z-10"
        style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
      >
        <span
          className="absolute right-1.5 top-1.5 font-[family-name:var(--font-display)] text-[10px] tabular-nums text-text-muted"
        >
          {index}
        </span>
        <span
          className="font-[family-name:var(--font-display)] text-2xl font-bold leading-none"
          style={{ color }}
        >
          {symbol}
        </span>
        <span className="mt-2 w-full truncate px-1.5 text-center text-[9px] font-medium text-text-secondary">
          {term}
        </span>
        <span className="mt-0.5 text-[8px] text-text-muted">
          {category}
        </span>
      </Link>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-border-bright bg-surface-elevated p-3 shadow-xl shadow-black/40">
          <p className="text-[11px] leading-relaxed text-text-secondary">{tooltip}</p>
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border-bright bg-surface-elevated" />
        </div>
      )}
    </div>
  );
}
