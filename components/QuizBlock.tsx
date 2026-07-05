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
    const base = 'quiz-option w-full text-left rounded-xl border px-4 py-3.5 text-sm leading-relaxed';
    if (!revealed) {
      return `${base} border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer`;
    }
    if (index === correctIndex) {
      return `${base} border-emerald-300 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200`;
    }
    if (index === selected && index !== correctIndex) {
      return `${base} border-red-300 bg-red-50 text-red-900 ring-1 ring-red-200`;
    }
    return `${base} border-gray-100 bg-gray-50/50 text-gray-400`;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 shadow-sm">
      <div className="border-b border-indigo-100/60 bg-indigo-50/40 px-6 py-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Test yourself
          </span>
        </div>
      </div>
      <div className="p-6">
        <p className="mb-5 text-[15px] font-medium leading-relaxed text-gray-900">{question}</p>
        <div className="space-y-2.5">
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
          <div className={`mt-5 rounded-xl p-4 text-sm leading-relaxed ${
            selected === correctIndex
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border border-amber-200 bg-amber-50 text-amber-800'
          }`}>
            <span className="font-semibold">
              {selected === correctIndex ? 'Correct!' : 'Not quite.'}
            </span>{' '}
            {explanation}
          </div>
        )}
      </div>
    </div>
  );
}
