'use client';

import { useState } from 'react';

interface QuizBlockProps {
  question: string;
  options: [string, string, string, string];
  answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

const ANSWER_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

export default function QuizBlock({ question, options, answer, explanation }: QuizBlockProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correctIndex = ANSWER_INDEX[answer];

  function handleSelect(index: number) {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
  }

  function getOptionStyle(index: number): string {
    const base = 'quiz-option w-full text-left rounded-lg border px-4 py-3 text-sm leading-relaxed';
    if (!revealed) {
      return `${base} border-border bg-surface text-text-secondary cursor-pointer`;
    }
    if (index === correctIndex) {
      return `${base} border-emerald-500/40 bg-emerald-500/10 text-emerald-300`;
    }
    if (index === selected && index !== correctIndex) {
      return `${base} border-red-500/40 bg-red-500/10 text-red-300`;
    }
    return `${base} border-border bg-surface/30 text-text-muted`;
  }

  return (
    <div className="rounded-xl border border-accent-indigo/20 bg-accent-indigo-dim/20 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-accent-indigo/10 px-5 py-3">
        <svg className="h-4 w-4 text-accent-indigo-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span className="font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-wider text-accent-indigo-light">
          Test yourself
        </span>
      </div>
      <div className="p-5">
        <p className="mb-5 text-sm font-medium leading-relaxed text-text-primary">{question}</p>
        <div className="space-y-2">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={getOptionStyle(i)}
              disabled={revealed}
            >
              {option}
            </button>
          ))}
        </div>
        {revealed && (
          <div className={`mt-4 rounded-lg border p-4 text-sm leading-relaxed ${
            selected === correctIndex
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
          }`}>
            <span className="font-semibold">
              {selected === correctIndex ? 'Correct.' : 'Not quite.'}
            </span>{' '}
            {explanation}
          </div>
        )}
      </div>
    </div>
  );
}
