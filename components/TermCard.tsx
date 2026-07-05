import Link from 'next/link';

import { Term, isTier1, isTier2, Category } from '@/lib/types';
import { CATEGORY_SLUGS, CATEGORY_COLORS } from '@/lib/categories';
import { getTermsByCategory } from '@/lib/terms';

import TierBadge from './TierBadge';
import QuizBlock from './QuizBlock';
import RelatedTerms from './RelatedTerms';

interface TermCardProps {
  term: Term;
  slug?: string;
}

function getSymbol(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z]/g, '');
  return cleaned.slice(0, 3).toUpperCase();
}

function getAtomicIndex(term: Term): number {
  const siblings = getTermsByCategory(term.category)
    .sort((a, b) => a.term.localeCompare(b.term));
  const idx = siblings.findIndex(t => t.slug === term.slug);
  return idx + 1;
}

export default function TermCard({ term, slug }: TermCardProps) {
  const catColor = CATEGORY_COLORS[term.category as Category];
  const symbol = getSymbol(term.term);
  const atomicIndex = getAtomicIndex(term);

  return (
    <article className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      {/* Main glass card */}
      <div className="glass-panel-elevated noise relative overflow-hidden rounded-2xl p-8 sm:p-10">
        <div className="relative">
          {/* Identity plate */}
          <header className="mb-10">
            <div
              className="mb-8 rounded-xl border p-6"
              style={{
                borderColor: `${catColor}25`,
                background: `linear-gradient(135deg, ${catColor}08 0%, transparent 60%)`,
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="font-[family-name:var(--font-display)] text-xs font-medium tabular-nums"
                    style={{ color: `${catColor}90` }}
                  >
                    {String(atomicIndex).padStart(2, '0')}
                  </span>
                  <div
                    className="mt-2 font-[family-name:var(--font-display)] text-5xl font-bold leading-none tracking-tighter sm:text-6xl"
                    style={{ color: catColor }}
                  >
                    {symbol}
                  </div>
                  <p className="mt-3 text-sm font-medium text-text-primary">
                    {term.term}
                  </p>
                  <Link
                    href={`/categories/${CATEGORY_SLUGS[term.category as Category]}`}
                    className="mt-1 inline-block text-xs text-text-muted transition-colors hover:text-text-secondary"
                  >
                    {term.category}
                  </Link>
                </div>
                <TierBadge tier={term.tier} />
              </div>
            </div>
          </header>

          {/* Definition */}
          <section className="mb-8">
            <p className="text-[15px] leading-[1.8] text-text-secondary">{term.definition_plain}</p>
          </section>

          {/* Scenario — Tier 2+ */}
          {isTier2(term) && (
            <section className="mb-8 rounded-xl border border-accent-amber-dim bg-accent-amber-dim/30 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-accent-amber">&#x2728;</span>
                <span className="font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-wider text-accent-amber">
                  In the wild
                </span>
              </div>
              <p className="mb-4 text-sm italic leading-relaxed text-text-secondary">
                &ldquo;{term.scenario.meeting_line}&rdquo;
              </p>
              <div className="rounded-lg border border-border bg-surface/60 p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Sound smart — ask this
                </p>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {term.scenario.smart_followup}
                </p>
              </div>
            </section>
          )}

          {/* Quiz — Tier 2+ */}
          {isTier2(term) && (
            <section className="mb-8">
              <QuizBlock
                question={term.quiz_question.question}
                options={term.quiz_question.options}
                answer={term.quiz_question.answer}
                explanation={term.quiz_question.explanation}
                slug={slug ?? term.slug}
              />
            </section>
          )}

          {/* Company example — Tier 1 only */}
          {isTier1(term) && (
            <section className="mb-8 rounded-xl border border-border bg-surface/50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Real-world deployment
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-text-secondary">{term.company_example.text}</p>
              <a
                href={term.company_example.citation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-void-lighter px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent-indigo/40 hover:text-accent-indigo-light"
              >
                {term.company_example.citation_label}
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </section>
          )}

          {/* Related terms */}
          {term.related_terms.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Related terms
              </h2>
              <RelatedTerms slugs={term.related_terms} />
            </section>
          )}

          {/* Source link */}
          {term.source_url && (
            <footer className="border-t border-border pt-6">
              <a
                href={term.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-void-lighter px-4 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-accent-indigo/40 hover:text-accent-indigo-light hover:shadow-sm"
              >
                <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Go deeper &mdash; {term.source_label}
              </a>
            </footer>
          )}
        </div>
      </div>
    </article>
  );
}
