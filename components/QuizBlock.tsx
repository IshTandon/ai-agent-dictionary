'use client';

import { useState } from 'react';

import { trackQuizAttempt } from '@/lib/progress';

interface QuizBlockProps {
  question: string;
  options: [string, string, string, string];
  answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  slug: string;
}

const LETTERS = ['A', 'B', 'C', 'D'];
const ANSWER_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

export default function QuizBlock({ question, options, answer, explanation, slug }: QuizBlockProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [xpGained, setXpGained] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);

  const correctIndex = ANSWER_INDEX[answer];

  function handleSelect(index: number) {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);

    const correct = index === correctIndex;
    const gained = trackQuizAttempt(slug, correct);
    setXpGained(gained);

    if (!correct) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }

    setTimeout(() => setXpGained(null), 2000);
  }

  function getOptionStyle(index: number): React.CSSProperties {
    const base: React.CSSProperties = {
      backgroundColor: 'var(--color-card)',
      border: '0.5px solid var(--color-border)',
      borderRadius: '10px',
      padding: '10px 12px',
      cursor: revealed ? 'default' : 'pointer',
      transition: 'border-color 0.15s ease, background 0.15s ease',
    };

    if (!revealed) return base;

    if (index === correctIndex) {
      return {
        ...base,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.08)',
      };
    }
    if (index === selected && index !== correctIndex) {
      return {
        ...base,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239,68,68,0.06)',
      };
    }
    return { ...base, opacity: 0.5 };
  }

  function getLetterColor(index: number): string {
    if (!revealed) return 'var(--color-accent-soft)';
    if (index === correctIndex) return '#10B981';
    if (index === selected && index !== correctIndex) return '#EF4444';
    return 'var(--color-dim)';
  }

  function getTextColor(index: number): string {
    if (!revealed) return 'var(--color-muted)';
    if (index === correctIndex) return 'var(--color-text)';
    if (index === selected && index !== correctIndex) return 'var(--color-muted)';
    return 'var(--color-dim)';
  }

  return (
    <div className={`relative ${shaking ? 'shake' : ''}`}>
      {xpGained !== null && (
        <div
          className="xp-toast absolute right-0 -top-2 z-10 rounded-lg px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] font-bold"
          style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#6EE7B7' }}
        >
          +{xpGained} XP
        </div>
      )}

      <p className="mb-4 text-[14px] leading-[1.65]" style={{ color: 'var(--color-text)' }}>
        {question}
      </p>

      <div className="flex flex-col gap-2">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className="quiz-option flex w-full items-start gap-2.5 text-left"
            style={getOptionStyle(i)}
            disabled={revealed}
          >
            <span
              className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] font-bold"
              style={{ color: getLetterColor(i), marginTop: '1px' }}
            >
              {LETTERS[i]}
            </span>
            <span className="text-[13px]" style={{ color: getTextColor(i) }}>
              {option.replace(/^[A-D]\)\s*/, '')}
            </span>
          </button>
        ))}
      </div>

      {revealed && (
        <div
          className="mt-3"
          style={{
            backgroundColor: selected === correctIndex ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)',
            border: selected === correctIndex ? '0.5px solid rgba(16,185,129,0.25)' : '0.5px solid rgba(239,68,68,0.2)',
            borderRadius: '10px',
            padding: '10px 12px',
          }}
        >
          <p className="text-[12px] leading-relaxed" style={{ color: selected === correctIndex ? '#6EE7B7' : '#FCA5A5' }}>
            <span className="font-bold" style={{ color: selected === correctIndex ? '#10B981' : '#EF4444' }}>
              {selected === correctIndex ? 'Correct.' : 'Not quite.'}
            </span>{' '}
            {explanation}{' '}
            <span style={{ color: selected === correctIndex ? '#10B981' : 'var(--color-dim)' }}>
              {selected === correctIndex ? '+25 XP earned.' : '+10 XP for trying.'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
