import Link from 'next/link';

import { Term, isTier1, isTier2, Category } from '@/lib/types';
import { CATEGORY_SLUGS } from '@/lib/categories';

import TierBadge from './TierBadge';
import QuizBlock from './QuizBlock';
import RelatedTerms from './RelatedTerms';

interface TermCardProps {
  term: Term;
}

export default function TermCard({ term }: TermCardProps) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <Link
            href={`/categories/${CATEGORY_SLUGS[term.category as Category]}`}
            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
          >
            {term.category}
          </Link>
          <TierBadge tier={term.tier} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          {term.term}
        </h1>
      </header>

      <section className="mb-10">
        <p className="text-[17px] leading-[1.75] text-gray-600">{term.definition_plain}</p>
      </section>

      {isTier2(term) && (
        <section className="fade-in mb-10 overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50/30">
          <div className="border-b border-amber-200/40 px-6 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700/80">
              In the wild
            </span>
          </div>
          <div className="px-6 py-5">
            <div className="mb-4">
              <p className="text-[13px] font-medium text-amber-800/60 mb-1.5">Where you&apos;d hear this</p>
              <p className="text-sm leading-relaxed text-gray-800 italic">
                &ldquo;{term.scenario.meeting_line}&rdquo;
              </p>
            </div>
            <div className="rounded-xl bg-white/60 p-4 border border-amber-100">
              <p className="text-[13px] font-medium text-amber-800/60 mb-1.5">Sound smart — ask this</p>
              <p className="text-sm leading-relaxed text-gray-700">{term.scenario.smart_followup}</p>
            </div>
          </div>
        </section>
      )}

      {isTier2(term) && (
        <section className="fade-in mb-10" style={{ animationDelay: '100ms' }}>
          <QuizBlock
            question={term.quiz_question.question}
            options={term.quiz_question.options}
            answer={term.quiz_question.answer}
            explanation={term.quiz_question.explanation}
          />
        </section>
      )}

      {isTier1(term) && (
        <section className="fade-in mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50/50" style={{ animationDelay: '200ms' }}>
          <div className="border-b border-gray-200/60 px-6 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Real-world deployment
            </span>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm leading-relaxed text-gray-600">{term.company_example.text}</p>
            <a
              href={term.company_example.citation_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-700 hover:shadow"
            >
              {term.company_example.citation_label}
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </section>
      )}

      {term.related_terms.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Related terms</h2>
          <RelatedTerms slugs={term.related_terms} />
        </section>
      )}

      <footer className="border-t border-gray-200/60 pt-8">
        {term.source_url && (
          <a
            href={term.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-700 hover:shadow-md"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Go deeper: {term.source_label}
          </a>
        )}
      </footer>
    </article>
  );
}
