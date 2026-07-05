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
    const base = 'w-full text-left rounded-lg border px-4 py-3 text-sm transition-all';
    if (!revealed) {
      return `${base} border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer`;
    }
    if (index === correctIndex) {
      return `${base} border-green-400 bg-green-50 text-green-900`;
    }
    if (index === selected && index !== correctIndex) {
      return `${base} border-red-400 bg-red-50 text-red-900`;
    }
    return `${base} border-gray-200 opacity-50`;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
        Quick Quiz
      </h3>
      <p className="mb-4 text-sm font-medium text-gray-900">{question}</p>
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
        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
          <span className="font-semibold">
            {selected === correctIndex ? 'Correct!' : 'Not quite.'}
          </span>{' '}
          {explanation}
        </div>
      )}
    </div>
  );
}
