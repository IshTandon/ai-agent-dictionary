'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  getProgress,
  saveProgress,
  addXP,
  completeSession,
  resetLastSeen,
  isSessionCompletedToday,
  todayISO,
} from '@/lib/progress';
import { isTier2 } from '@/lib/types';
import type { Term } from '@/lib/types';

type SessionItem = {
  term: Term;
  kind: 'new' | 'review';
};

function seedRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = h ^ (h << 13);
    h = h ^ (h >> 17);
    h = h ^ (h << 5);
    return (h >>> 0) / 4294967296;
  };
}

function buildSession(allTerms: Term[], seed?: string): SessionItem[] {
  const p = getProgress();
  const viewed = new Set(p.viewed_terms);
  const lastSeen = p.last_seen || {};
  const rand = seedRandom(seed ?? todayISO());

  const unseen = allTerms
    .filter(t => !viewed.has(t.slug))
    .sort((a, b) => a.tier - b.tier || rand() - 0.5);

  const reviewPool = allTerms
    .filter(t => viewed.has(t.slug))
    .sort((a, b) => {
      const aDate = lastSeen[a.slug] || '1970-01-01';
      const bDate = lastSeen[b.slug] || '1970-01-01';
      return aDate.localeCompare(bDate);
    });

  const newTerms = unseen.slice(0, 2);
  const needed = 5 - newTerms.length;
  const reviewTerms = reviewPool.slice(0, Math.min(3, needed));

  const items: SessionItem[] = [
    ...newTerms.map(t => ({ term: t, kind: 'new' as const })),
    ...reviewTerms.map(t => ({ term: t, kind: 'review' as const })),
  ];

  while (items.length < 5 && unseen.length > items.filter(i => i.kind === 'new').length) {
    const next = unseen[items.filter(i => i.kind === 'new').length];
    if (next) items.push({ term: next, kind: 'new' });
  }

  const shuffled = items.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 5);
}

function buildBonusRound(allTerms: Term[]): SessionItem[] {
  const p = getProgress();
  const lastSeen = p.last_seen || {};
  const viewed = new Set(p.viewed_terms);
  const seed = `${Date.now()}-${Math.random()}`;
  const rand = seedRandom(seed);

  const quizTerms = allTerms.filter(t => isTier2(t));
  const reviewPool = allTerms
    .filter(t => viewed.has(t.slug))
    .sort((a, b) => {
      const aDate = lastSeen[a.slug] || '1970-01-01';
      const bDate = lastSeen[b.slug] || '1970-01-01';
      return aDate.localeCompare(bDate);
    });

  const pool = [...quizTerms, ...reviewPool];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const seen = new Set<string>();
  const items: SessionItem[] = [];
  for (const t of pool) {
    if (seen.has(t.slug)) continue;
    seen.add(t.slug);
    items.push({ term: t, kind: viewed.has(t.slug) ? 'review' : 'new' });
    if (items.length >= 5) break;
  }
  return items;
}

export default function SessionPage() {
  const router = useRouter();
  const [allTerms, setAllTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [bonusMode, setBonusMode] = useState(false);

  useEffect(() => {
    fetch('/api/terms')
      .then(r => r.json())
      .then((terms: Term[]) => {
        setAllTerms(terms);
        setAlreadyDone(isSessionCompletedToday());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-sm" style={{ color: 'var(--color-dim)' }}>Loading session...</div>
      </div>
    );
  }

  if (allTerms.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--color-dim)' }}>No terms available.</p>
      </div>
    );
  }

  if (alreadyDone && !bonusMode) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <div className="mb-4 text-5xl">✓</div>
        <h2 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-[700]" style={{ color: 'var(--color-text)' }}>
          Already done today
        </h2>
        <p className="mb-2 text-lg" style={{ color: 'var(--color-amber)' }}>
          🔥 {getProgress().streak}
        </p>
        <div className="flex w-full flex-col gap-3">
          <button
            onClick={() => setBonusMode(true)}
            className="w-full rounded-xl py-3.5 text-[14px] font-medium"
            style={{ backgroundColor: 'var(--color-accent)', color: 'white', cursor: 'pointer' }}
          >
            Bonus round &rarr;
          </button>
          <p className="text-[11px]" style={{ color: 'var(--color-dim)' }}>
            Streak&apos;s safe &mdash; this is extra credit
          </p>
          <Link
            href="/"
            className="rounded-xl py-3 text-center text-[14px] font-medium"
            style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)', color: 'var(--color-muted)' }}
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SessionFlow
      allTerms={allTerms}
      isBonus={bonusMode}
      onBonusAgain={() => setBonusMode(false)}
    />
  );
}

function SessionFlow({
  allTerms,
  isBonus,
  onBonusAgain,
}: {
  allTerms: Term[];
  isBonus: boolean;
  onBonusAgain: () => void;
}) {
  const router = useRouter();
  const [bonusKey, setBonusKey] = useState(0);

  const session = useMemo(
    () => isBonus ? buildBonusRound(allTerms) : buildSession(allTerms),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allTerms, isBonus, bonusKey]
  );

  const [step, setStep] = useState(0);
  const [xpTotal, setXpTotal] = useState(0);
  const [done, setDone] = useState(false);
  const [streakInfo, setStreakInfo] = useState({ old: 0, new: 0 });
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepXP, setStepXP] = useState<Record<number, number>>({});

  const current = session[step];
  const total = session.length;
  const isStepCompleted = completedSteps.has(step);

  const newCount = session.filter(s => s.kind === 'new').length;
  const reviewCount = session.filter(s => s.kind === 'review').length;

  const maxStepReached = Math.max(...Array.from(completedSteps), step);

  const handleXP = useCallback((amount: number, stepIndex: number) => {
    if (completedSteps.has(stepIndex)) return;
    addXP(amount);
    setXpTotal(prev => prev + amount);
    setStepXP(prev => ({ ...prev, [stepIndex]: (prev[stepIndex] || 0) + amount }));
  }, [completedSteps]);

  const markCompleted = useCallback((stepIndex: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(stepIndex);
      return next;
    });
  }, []);

  const advance = useCallback(() => {
    if (step + 1 >= total) {
      if (!isBonus) {
        const { oldStreak, newStreak } = completeSession();
        setStreakInfo({ old: oldStreak, new: newStreak });
      }
      setDone(true);
    } else {
      setStep(s => s + 1);
    }
  }, [step, total, isBonus]);

  const goBack = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  if (done) {
    return (
      <SessionDone
        xpEarned={xpTotal}
        newCount={newCount}
        reviewCount={reviewCount}
        streakOld={streakInfo.old}
        streakNew={streakInfo.new}
        isBonus={isBonus}
        onBonusRound={() => {
          setStep(0);
          setXpTotal(0);
          setDone(false);
          setCompletedSteps(new Set());
          setStepXP({});
          setBonusKey(k => k + 1);
        }}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-lg flex-col px-5 py-6">
      {/* Top bar */}
      <div className="mb-8 flex items-center gap-2">
        <button
          onClick={() => setShowConfirmExit(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--color-muted)', backgroundColor: 'var(--color-card)' }}
          aria-label="Exit session"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {step > 0 && (
          <button
            onClick={goBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--color-muted)', backgroundColor: 'var(--color-card)' }}
            aria-label="Previous step"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex flex-1 items-center gap-2">
          {session.map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: completedSteps.has(i) || i === step
                  ? 'var(--color-accent)'
                  : 'var(--color-border)',
              }}
            />
          ))}
        </div>
        <span className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: 'var(--color-dim)' }}>
          {step + 1}/{total}
        </span>
      </div>

      {/* Confirm exit dialog */}
      {showConfirmExit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            className="mx-4 w-full max-w-sm rounded-2xl p-6"
            style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)' }}
          >
            <h3 className="mb-2 font-[family-name:var(--font-display)] text-lg font-[700]" style={{ color: 'var(--color-text)' }}>
              Leave session?
            </h3>
            <p className="mb-5 text-[13px]" style={{ color: 'var(--color-muted)' }}>
              Your progress in this session won&apos;t be saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmExit(false)}
                className="flex-1 rounded-lg px-4 py-2.5 text-[13px] font-medium"
                style={{ backgroundColor: 'var(--color-surface)', border: '0.5px solid var(--color-border)', color: 'var(--color-muted)', cursor: 'pointer' }}
              >
                Stay
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 rounded-lg px-4 py-2.5 text-[13px] font-medium"
                style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#EF4444', cursor: 'pointer' }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card content */}
      <div className="flex flex-1 flex-col">
        {current.kind === 'new' ? (
          <NewTermStep
            key={`${step}-${bonusKey}`}
            item={current}
            stepIndex={step}
            completed={isStepCompleted}
            earnedXP={stepXP[step] || 0}
            onXP={(n) => handleXP(n, step)}
            onComplete={() => markCompleted(step)}
            onAdvance={advance}
          />
        ) : (
          <ReviewStep
            key={`${step}-${bonusKey}`}
            item={current}
            stepIndex={step}
            completed={isStepCompleted}
            earnedXP={stepXP[step] || 0}
            onXP={(n) => handleXP(n, step)}
            onComplete={() => markCompleted(step)}
            onAdvance={advance}
          />
        )}
      </div>
    </div>
  );
}

function NewTermStep({
  item,
  stepIndex,
  completed,
  earnedXP,
  onXP,
  onComplete,
  onAdvance,
}: {
  item: SessionItem;
  stepIndex: number;
  completed: boolean;
  earnedXP: number;
  onXP: (n: number) => void;
  onComplete: () => void;
  onAdvance: () => void;
}) {
  const [acknowledged, setAcknowledged] = useState(completed);
  const { term } = item;
  const symbol = term.term.slice(0, 2).toUpperCase();

  function handleGotIt() {
    if (completed) return;
    onXP(5);
    const p = getProgress();
    if (!p.viewed_terms.includes(term.slug)) {
      p.viewed_terms.push(term.slug);
    }
    if (!p.last_seen) p.last_seen = {};
    p.last_seen[term.slug] = new Date().toISOString();
    saveProgress(p);
    setAcknowledged(true);
    onComplete();
    setTimeout(onAdvance, 400);
  }

  return (
    <div className="flex flex-1 flex-col animate-fade-in">
      <span
        className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
        style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--color-green)' }}
      >
        New term
      </span>
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-[family-name:var(--font-mono)] text-[16px] font-bold"
          style={{ backgroundColor: 'var(--color-card)', color: 'var(--color-accent)' }}
        >
          {symbol}
        </span>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-[700] leading-tight tracking-tight" style={{ color: 'var(--color-text)' }}>
          {term.term}
        </h2>
      </div>
      <p className="mb-8 text-[15px] leading-[1.75]" style={{ color: 'var(--color-muted)' }}>
        {term.definition_plain}
      </p>

      <div className="mt-auto">
        {completed ? (
          <button
            onClick={onAdvance}
            className="w-full rounded-xl py-3.5 text-[14px] font-medium"
            style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', cursor: 'pointer' }}
          >
            ✓ +{earnedXP} XP &middot; Next &rarr;
          </button>
        ) : (
          <button
            onClick={handleGotIt}
            disabled={acknowledged}
            className="w-full rounded-xl py-3.5 text-[14px] font-medium transition-all"
            style={{
              backgroundColor: acknowledged ? 'rgba(16,185,129,0.15)' : 'var(--color-accent)',
              color: acknowledged ? '#10B981' : 'white',
              cursor: acknowledged ? 'default' : 'pointer',
            }}
          >
            {acknowledged ? '✓ +5 XP' : 'Got it → +5 XP'}
          </button>
        )}
      </div>
    </div>
  );
}

function ReviewStep({
  item,
  stepIndex,
  completed,
  earnedXP,
  onXP,
  onComplete,
  onAdvance,
}: {
  item: SessionItem;
  stepIndex: number;
  completed: boolean;
  earnedXP: number;
  onXP: (n: number) => void;
  onComplete: () => void;
  onAdvance: () => void;
}) {
  const { term } = item;
  const hasQuiz = isTier2(term);

  if (hasQuiz) {
    return (
      <ReviewQuiz
        term={term}
        completed={completed}
        earnedXP={earnedXP}
        onXP={onXP}
        onComplete={onComplete}
        onAdvance={onAdvance}
      />
    );
  }

  return (
    <ReviewFlipCard
      term={term}
      completed={completed}
      earnedXP={earnedXP}
      onXP={onXP}
      onComplete={onComplete}
      onAdvance={onAdvance}
    />
  );
}

function ReviewQuiz({
  term,
  completed,
  earnedXP,
  onXP,
  onComplete,
  onAdvance,
}: {
  term: Term;
  completed: boolean;
  earnedXP: number;
  onXP: (n: number) => void;
  onComplete: () => void;
  onAdvance: () => void;
}) {
  const quiz = isTier2(term) ? term.quiz_question : null;
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(completed);
  const [shaking, setShaking] = useState(false);

  if (!quiz) return null;

  const ANSWER_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
  const correctIndex = ANSWER_INDEX[quiz.answer];

  function handleSelect(index: number) {
    if (revealed || completed) return;
    setSelected(index);
    setRevealed(true);
    const correct = index === correctIndex;
    const xp = correct ? 25 : 0;
    if (xp > 0) onXP(xp);
    if (!correct) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
    const p = getProgress();
    if (!p.last_seen) p.last_seen = {};
    p.last_seen[term.slug] = new Date().toISOString();
    saveProgress(p);
    onComplete();
    setTimeout(onAdvance, 1500);
  }

  return (
    <div className={`flex flex-1 flex-col animate-fade-in ${shaking ? 'shake' : ''}`}>
      <span
        className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
        style={{ backgroundColor: 'rgba(139,124,255,0.12)', color: 'var(--color-accent)' }}
      >
        Review
      </span>
      <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl font-[700] leading-tight" style={{ color: 'var(--color-text)' }}>
        {term.term}
      </h2>
      <p className="mb-6 text-[14px] leading-[1.65]" style={{ color: 'var(--color-text)' }}>
        {quiz.question}
      </p>
      <div className="flex flex-col gap-2.5">
        {quiz.options.map((option, i) => {
          const letter = ['A', 'B', 'C', 'D'][i];
          let bg = 'var(--color-card)';
          let border = '0.5px solid var(--color-border)';
          let textColor = 'var(--color-muted)';

          if (revealed || completed) {
            if (i === correctIndex) {
              bg = 'rgba(16,185,129,0.08)';
              border = '1px solid #10B981';
              textColor = 'var(--color-text)';
            } else if (i === selected) {
              bg = 'rgba(239,68,68,0.06)';
              border = '1px solid #EF4444';
            } else {
              textColor = 'var(--color-dim)';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed || completed}
              className="flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left transition-colors"
              style={{ backgroundColor: bg, border, cursor: (revealed || completed) ? 'default' : 'pointer' }}
            >
              <span className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] font-bold" style={{ color: 'var(--color-accent-soft)', marginTop: '2px' }}>
                {letter}
              </span>
              <span className="text-[13px]" style={{ color: textColor }}>
                {option.replace(/^[A-D]\)\s*/, '')}
              </span>
            </button>
          );
        })}
      </div>

      {(revealed || completed) && (
        <div
          className="mt-4 rounded-xl p-4"
          style={{
            backgroundColor: (selected === correctIndex || (completed && earnedXP > 0))
              ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)',
            border: (selected === correctIndex || (completed && earnedXP > 0))
              ? '0.5px solid rgba(16,185,129,0.25)' : '0.5px solid rgba(239,68,68,0.2)',
          }}
        >
          <p className="text-[12px] font-bold" style={{
            color: (selected === correctIndex || (completed && earnedXP > 0)) ? '#10B981' : '#EF4444'
          }}>
            {(selected === correctIndex || (completed && earnedXP > 0))
              ? `Correct! +25 XP` : 'Not quite — no XP this time'}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            {quiz.explanation}
          </p>
        </div>
      )}

      {completed && (
        <div className="mt-4">
          <button
            onClick={onAdvance}
            className="w-full rounded-xl py-3 text-[14px] font-medium"
            style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer' }}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewFlipCard({
  term,
  completed,
  earnedXP,
  onXP,
  onComplete,
  onAdvance,
}: {
  term: Term;
  completed: boolean;
  earnedXP: number;
  onXP: (n: number) => void;
  onComplete: () => void;
  onAdvance: () => void;
}) {
  const [flipped, setFlipped] = useState(completed);
  const [answered, setAnswered] = useState(completed);

  function handleKnew() {
    if (completed) return;
    onXP(10);
    const p = getProgress();
    if (!p.last_seen) p.last_seen = {};
    p.last_seen[term.slug] = new Date().toISOString();
    saveProgress(p);
    setAnswered(true);
    onComplete();
    setTimeout(onAdvance, 400);
  }

  function handleStillLearning() {
    if (completed) return;
    onXP(2);
    resetLastSeen(term.slug);
    setAnswered(true);
    onComplete();
    setTimeout(onAdvance, 400);
  }

  if (completed) {
    return (
      <div className="flex flex-1 flex-col animate-fade-in">
        <span
          className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
          style={{ backgroundColor: 'rgba(139,124,255,0.12)', color: 'var(--color-accent)' }}
        >
          Review
        </span>
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-[700] leading-tight" style={{ color: 'var(--color-text)' }}>
          {term.term}
        </h2>
        <p className="mb-8 text-[14px] leading-[1.75]" style={{ color: 'var(--color-muted)' }}>
          {term.definition_plain}
        </p>
        <div className="mt-auto">
          <button
            onClick={onAdvance}
            className="w-full rounded-xl py-3 text-[14px] font-medium"
            style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', cursor: 'pointer' }}
          >
            ✓ +{earnedXP} XP &middot; Next &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col animate-fade-in">
      <span
        className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
        style={{ backgroundColor: 'rgba(139,124,255,0.12)', color: 'var(--color-accent)' }}
      >
        Review
      </span>
      <h2 className="mb-6 font-[family-name:var(--font-display)] text-xl font-[700] leading-tight" style={{ color: 'var(--color-text)' }}>
        Can you explain&hellip;
      </h2>
      <div
        className="mb-8 rounded-2xl p-6 text-center"
        style={{ backgroundColor: 'var(--color-surface)', border: '0.5px solid var(--color-border)' }}
      >
        <p className="font-[family-name:var(--font-display)] text-2xl font-[700]" style={{ color: 'var(--color-text)' }}>
          {term.term}
        </p>
      </div>

      {!flipped ? (
        <button
          onClick={() => setFlipped(true)}
          className="w-full rounded-xl py-3.5 text-[14px] font-medium transition-colors"
          style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer' }}
        >
          Tap to reveal definition
        </button>
      ) : (
        <div className="animate-fade-in">
          <p className="mb-8 text-[14px] leading-[1.75]" style={{ color: 'var(--color-muted)' }}>
            {term.definition_plain}
          </p>
          <div className="mt-auto flex gap-3">
            <button
              onClick={handleStillLearning}
              disabled={answered}
              className="flex-1 rounded-xl py-3 text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: answered ? 'var(--color-card)' : 'var(--color-surface)',
                border: '0.5px solid var(--color-border)',
                color: 'var(--color-muted)',
                cursor: answered ? 'default' : 'pointer',
              }}
            >
              Still learning +2 XP
            </button>
            <button
              onClick={handleKnew}
              disabled={answered}
              className="flex-1 rounded-xl py-3 text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: answered ? 'rgba(16,185,129,0.15)' : 'var(--color-accent)',
                color: answered ? '#10B981' : 'white',
                cursor: answered ? 'default' : 'pointer',
              }}
            >
              I knew it +10 XP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionDone({
  xpEarned,
  newCount,
  reviewCount,
  streakOld,
  streakNew,
  isBonus = false,
  onBonusRound,
}: {
  xpEarned: number;
  newCount: number;
  reviewCount: number;
  streakOld: number;
  streakNew: number;
  isBonus?: boolean;
  onBonusRound?: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center animate-fade-in">
      <div className="mb-2 text-5xl">{isBonus ? '⭐' : '🎉'}</div>

      <h2 className="mb-1 font-[family-name:var(--font-display)] text-3xl font-[700]" style={{ color: 'var(--color-text)' }}>
        +{xpEarned} XP {isBonus ? 'bonus' : 'today'}
      </h2>

      {!isBonus && streakNew > streakOld && (
        <p className="mb-4 text-lg" style={{ color: 'var(--color-amber)' }}>
          🔥 {streakOld} &rarr; {streakNew}
        </p>
      )}

      <div className="mb-6 flex items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />
        ))}
      </div>

      <p className="mb-8 text-[13px]" style={{ color: 'var(--color-muted)' }}>
        {newCount} new &middot; {reviewCount} reviewed
      </p>

      <div className="flex w-full flex-col gap-3">
        <Link
          href="/"
          className="w-full rounded-xl py-3 text-center text-[14px] font-medium"
          style={{ backgroundColor: 'var(--color-card)', border: '0.5px solid var(--color-border)', color: 'var(--color-text)' }}
        >
          Done
        </Link>
        {onBonusRound && (
          <>
            <button
              onClick={onBonusRound}
              className="w-full rounded-xl py-3 text-[14px] font-medium"
              style={{ backgroundColor: 'var(--color-accent)', color: 'white', cursor: 'pointer' }}
            >
              Bonus round &rarr;
            </button>
            <p className="text-[11px]" style={{ color: 'var(--color-dim)' }}>
              Streak&apos;s safe &mdash; this is extra credit
            </p>
          </>
        )}
      </div>
    </div>
  );
}
