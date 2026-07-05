'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ViewToggle() {
  const pathname = usePathname();
  const isBrowse = pathname === '/';
  const isTable = pathname === '/table';

  return (
    <div className="inline-flex rounded-lg border border-border bg-surface p-0.5">
      <Link
        href="/"
        className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
          isBrowse
            ? 'bg-accent-indigo text-white'
            : 'text-text-muted hover:text-text-secondary'
        }`}
      >
        Browse
      </Link>
      <Link
        href="/table"
        className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
          isTable
            ? 'bg-accent-indigo text-white'
            : 'text-text-muted hover:text-text-secondary'
        }`}
      >
        Periodic Table
      </Link>
    </div>
  );
}
