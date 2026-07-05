'use client';

import Link from 'next/link';

import { Term, Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';

const CATEGORY_STYLE: Record<Category, { bg: string; text: string }> = {
  Foundation:    { bg: '#EEEDFE', text: '#3C3489' },
  Memory:        { bg: '#E6F1FB', text: '#0C447C' },
  Tools:         { bg: '#E1F5EE', text: '#085041' },
  Protocols:     { bg: '#FAECE7', text: '#712B13' },
  Retrieval:     { bg: '#FAEEDA', text: '#633806' },
  Orchestration: { bg: '#EAF3DE', text: '#27500A' },
  Evaluation:    { bg: '#FBEAF0', text: '#72243E' },
  Security:      { bg: '#FCEBEB', text: '#791F1F' },
  Observability: { bg: '#F1EFE8', text: '#444441' },
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function getSymbol(name: string): string {
  const trimmed = name.trim();
  const isAcronym = trimmed.length <= 5 && trimmed === trimmed.toUpperCase() && /^[A-Z0-9]+$/.test(trimmed);
  if (isAcronym) {
    return trimmed.padEnd(3, trimmed[trimmed.length - 1]).slice(0, 3);
  }

  const consonants: string[] = [];
  for (const ch of trimmed) {
    const lower = ch.toLowerCase();
    if (lower >= 'a' && lower <= 'z' && !VOWELS.has(lower)) {
      consonants.push(ch.toUpperCase());
      if (consonants.length === 3) break;
    }
  }

  if (consonants.length < 3) {
    for (const ch of trimmed) {
      if (ch >= 'A' && ch <= 'z' && consonants.length < 3) {
        const upper = ch.toUpperCase();
        if (!consonants.includes(upper) || consonants.length < 3) {
          consonants.push(upper);
        }
      }
      if (consonants.length === 3) break;
    }
  }

  return consonants.join('').slice(0, 3);
}

interface PeriodicTableProps {
  terms: Term[];
}

export default function PeriodicTable({ terms }: PeriodicTableProps) {
  let globalIndex = 0;

  const groups = CATEGORIES.map(cat => {
    const style = CATEGORY_STYLE[cat];
    const catTerms = terms
      .filter(t => t.category === cat)
      .sort((a, b) => a.term.localeCompare(b.term))
      .map(t => {
        globalIndex++;
        return {
          slug: t.slug,
          term: t.term,
          symbol: getSymbol(t.term),
          index: globalIndex,
        };
      });
    return { category: cat, style, terms: catTerms };
  });

  return (
    <div className="space-y-8">
      {groups.map(group => (
        <section key={group.category}>
          <div className="mb-3 flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: group.style.text }}
            />
            <h2
              className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wider"
              style={{ color: group.style.text }}
            >
              {group.category}
            </h2>
            <span className="text-[10px] text-text-muted">
              {group.terms.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.terms.map(t => (
              <Link
                key={t.slug}
                href={`/terms/${t.slug}`}
                className="relative flex h-[80px] w-[72px] cursor-pointer flex-col items-center justify-center rounded-[6px] transition-transform duration-150 hover:scale-105 hover:z-10"
                style={{
                  backgroundColor: group.style.bg,
                  color: group.style.text,
                }}
              >
                <span
                  className="absolute right-1 top-1 font-[family-name:var(--font-display)] text-[9px] tabular-nums"
                  style={{ opacity: 0.6 }}
                >
                  {String(t.index).padStart(2, '0')}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[18px] font-bold leading-none">
                  {t.symbol}
                </span>
                <span className="mt-1.5 line-clamp-2 w-full px-1 text-center text-[8px] leading-tight">
                  {t.term}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
