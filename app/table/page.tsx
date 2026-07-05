import { Metadata } from 'next';
import Link from 'next/link';

import { getAllTerms } from '@/lib/terms';
import { CATEGORIES, CATEGORY_COLORS } from '@/lib/categories';
import { Category } from '@/lib/types';
import PeriodicCell from '@/components/PeriodicCell';

export const metadata: Metadata = {
  title: 'Periodic Table of AI Agents | AI Agent Dictionary',
  description: 'All 100 AI agent terms visualized as a periodic table, grouped by category.',
};

const CONSONANTS = /[bcdfghjklmnpqrstvwxyz]/gi;

function getSymbol(name: string): string {
  if (name.length <= 3 && name === name.toUpperCase()) return name;

  const consonants = name.match(CONSONANTS);
  if (consonants && consonants.length >= 3) {
    return consonants.slice(0, 3).join('').toUpperCase();
  }
  return name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase();
}

function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?]/);
  return match ? match[0] : text.slice(0, 120) + '...';
}

export default function PeriodicTablePage() {
  const allTerms = getAllTerms();

  let globalIndex = 0;
  const categorizedTerms = CATEGORIES.map(cat => {
    const terms = allTerms
      .filter(t => t.category === cat)
      .sort((a, b) => a.term.localeCompare(b.term))
      .map(t => {
        globalIndex++;
        return {
          ...t,
          index: globalIndex,
          symbol: getSymbol(t.term),
          tooltip: firstSentence(t.definition_plain),
        };
      });
    return { category: cat, terms };
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
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
            100 terms. 9 categories. Hover for definitions.
          </p>
        </div>
        {/* Legend */}
        <div className="hidden sm:flex flex-wrap gap-3">
          {CATEGORIES.map(cat => (
            <div key={cat} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              <span className="text-[10px] text-text-muted">{cat}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="space-y-10">
        {categorizedTerms.map(({ category, terms }) => {
          const color = CATEGORY_COLORS[category as Category];
          return (
            <section key={category}>
              <div className="mb-3 flex items-center gap-2.5">
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <h2
                  className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider"
                  style={{ color }}
                >
                  {category}
                </h2>
                <span className="text-[10px] text-text-muted">
                  {terms.length} terms
                </span>
              </div>
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, 100px)',
                }}
              >
                {terms.map(t => (
                  <PeriodicCell
                    key={t.slug}
                    index={t.index}
                    symbol={t.symbol}
                    term={t.term}
                    slug={t.slug}
                    category={category}
                    color={color}
                    tooltip={t.tooltip}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
