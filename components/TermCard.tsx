import Link from 'next/link';

import { Term, isTier1, isTier2, Category } from '@/lib/types';
import { CATEGORY_SLUGS, CATEGORY_COLORS } from '@/lib/categories';
import { getSymbol } from '@/lib/symbols';

import TierBadge from './TierBadge';
import QuizBlock from './QuizBlock';
import RelatedTerms from './RelatedTerms';

interface TermCardProps {
  term: Term;
  slug?: string;
}

export default function TermCard({ term, slug }: TermCardProps) {
  const catColor = CATEGORY_COLORS[term.category as Category];
  const symbol = getSymbol(term.term, slug ?? term.slug);

  return (
    <article className="mx-auto max-w-[720px] px-6 py-10">
      {/* Hero card */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '16px',
          border: '0.5px solid var(--color-border)',
          borderTop: `2px solid ${catColor}`,
          padding: '28px',
        }}
      >
        {/* Watermark symbol */}
        <span
          className="pointer-events-none absolute font-[family-name:var(--font-mono)] font-bold leading-none select-none"
          style={{
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '104px',
            color: catColor,
            opacity: 0.06,
            zIndex: 0,
          }}
        >
          {symbol}
        </span>

        <div className="relative" style={{ zIndex: 1 }}>
          {/* Badges */}
          <div className="mb-5 flex items-center gap-2">
            <Link
              href={`/categories/${CATEGORY_SLUGS[term.category as Category]}`}
              className="rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors"
              style={{
                backgroundColor: `${catColor}25`,
                color: catColor,
                border: `1px solid ${catColor}4D`,
              }}
            >
              {term.category}
            </Link>
            <TierBadge tier={term.tier} />
          </div>

          {/* Term name */}
          <h1
            className="gradient-text mb-4 font-[family-name:var(--font-display)] text-4xl font-[700] leading-[1.05] tracking-tight md:text-6xl"
          >
            {term.term}
          </h1>

          {/* Definition */}
          <p className="text-[15px] leading-[1.8]" style={{ color: 'var(--color-text)', opacity: 0.9 }}>
            {term.definition_plain}
          </p>
        </div>
      </div>

      {/* Scenario — Tier 2+ */}
      {isTier2(term) && (
        <div
          className="mt-2.5"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '14px',
            border: '0.5px solid var(--color-border)',
            padding: '20px',
          }}
        >
          <p className="section-label mb-4 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
            Scenario
          </p>

          {/* Meeting line bubble */}
          <div
            className="mb-4"
            style={{
              backgroundColor: 'var(--color-card)',
              borderLeft: '3px solid var(--color-accent)',
              borderRadius: '10px',
              padding: '12px 14px',
            }}
          >
            <p className="mb-1.5 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
              In the meeting
            </p>
            <p className="text-[13px] italic leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              &ldquo;{term.scenario.meeting_line}&rdquo;
            </p>
          </div>

          {/* Smart follow-up */}
          <div
            style={{
              backgroundColor: 'rgba(124,111,255,0.08)',
              borderRadius: '10px',
              padding: '10px 14px',
            }}
          >
            <p className="mb-1.5 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
              💡 Sound smart — ask this
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              {term.scenario.smart_followup}
            </p>
          </div>
        </div>
      )}

      {/* Quiz — Tier 2+ */}
      {isTier2(term) && (
        <div
          className="mt-2.5"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '14px',
            border: '0.5px solid var(--color-border)',
            padding: '20px',
          }}
        >
          <p className="section-label mb-4 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
            Quiz
          </p>
          <QuizBlock
            question={term.quiz_question.question}
            options={term.quiz_question.options}
            answer={term.quiz_question.answer}
            explanation={term.quiz_question.explanation}
            slug={slug ?? term.slug}
          />
        </div>
      )}

      {/* Company example — Tier 1 */}
      {isTier1(term) && (
        <div
          className="mt-2.5"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '14px',
            border: '0.5px solid var(--color-border)',
            padding: '20px',
          }}
        >
          <p className="section-label mb-4 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
            Real-world example
          </p>
          <p className="mb-4 text-[13px] leading-[1.7]" style={{ color: 'var(--color-muted)' }}>
            {term.company_example.text}
          </p>
          <a
            href={term.company_example.citation_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors"
            style={{
              border: '0.5px solid rgba(124,111,255,0.3)',
              color: 'var(--color-accent-soft)',
            }}
          >
            {term.company_example.citation_label} ↗
          </a>
        </div>
      )}

      {/* Related terms */}
      {term.related_terms.length > 0 && (
        <div
          className="mt-2.5"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '14px',
            border: '0.5px solid var(--color-border)',
            padding: '20px',
          }}
        >
          <p className="section-label mb-4 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>
            Related terms
          </p>
          <RelatedTerms slugs={term.related_terms} />

          {/* Source link */}
          {term.source_url && (
            <>
              <div className="my-4" style={{ borderTop: '0.5px solid var(--color-border)' }} />
              <div className="flex justify-end">
                <a
                  href={term.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-medium transition-colors"
                  style={{ color: 'var(--color-accent-soft)' }}
                >
                  Go deeper → {term.source_label}
                </a>
              </div>
            </>
          )}
        </div>
      )}

      {/* Source link when no related terms */}
      {term.related_terms.length === 0 && term.source_url && (
        <div
          className="mt-2.5"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '14px',
            border: '0.5px solid var(--color-border)',
            padding: '20px',
          }}
        >
          <div className="flex justify-end">
            <a
              href={term.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium transition-colors"
              style={{ color: 'var(--color-accent-soft)' }}
            >
              Go deeper → {term.source_label}
            </a>
          </div>
        </div>
      )}
    </article>
  );
}
