import { Term, isTier1, isTier2 } from '@/lib/types';

import TierBadge from './TierBadge';
import QuizBlock from './QuizBlock';
import RelatedTerms from './RelatedTerms';

interface TermCardProps {
  term: Term;
}

export default function TermCard({ term }: TermCardProps) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {term.category}
          </span>
          <TierBadge tier={term.tier} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {term.term}
        </h1>
      </header>

      <section className="mb-8">
        <p className="text-lg leading-relaxed text-gray-700">{term.definition_plain}</p>
      </section>

      {isTier2(term) && (
        <section className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800">
            Where you&apos;d hear this
          </h2>
          <p className="mb-3 text-sm italic text-gray-800">
            &ldquo;{term.scenario.meeting_line}&rdquo;
          </p>
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
            Sound smart — ask this
          </h2>
          <p className="text-sm text-gray-700">{term.scenario.smart_followup}</p>
        </section>
      )}

      {isTier2(term) && (
        <section className="mb-8">
          <QuizBlock
            question={term.quiz_question.question}
            options={term.quiz_question.options}
            answer={term.quiz_question.answer}
            explanation={term.quiz_question.explanation}
          />
        </section>
      )}

      {isTier1(term) && (
        <section className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
            Real-world example
          </h2>
          <p className="mb-2 text-sm text-gray-700">{term.company_example.text}</p>
          <a
            href={term.company_example.citation_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            {term.company_example.citation_label} &rarr;
          </a>
        </section>
      )}

      {term.related_terms.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-gray-600">Related terms</h2>
          <RelatedTerms slugs={term.related_terms} />
        </section>
      )}

      <footer className="border-t border-gray-200 pt-6">
        <a
          href={term.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Go deeper: {term.source_label} &rarr;
        </a>
      </footer>
    </article>
  );
}
