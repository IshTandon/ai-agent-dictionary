import { Metadata } from 'next';
import Link from 'next/link';

import { getAllTerms } from '@/lib/terms';
import PeriodicTable from '@/components/PeriodicTable';

export const metadata: Metadata = {
  title: 'Periodic Table of AI Agents | Agent Atlas',
  description: 'All 100 AI agent terms visualized as a periodic table, grouped by category.',
};

export default function PeriodicTablePage() {
  const allTerms = getAllTerms();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10">
        <div className="mb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Periodic Table of AI Agents
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          100 terms. 9 categories. Click any element to learn it.
        </p>
      </header>

      <PeriodicTable terms={allTerms} />
    </div>
  );
}
